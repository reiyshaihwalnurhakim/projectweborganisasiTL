'use server'

import { prisma } from '@/lib/db'
import { memberSchema } from '@/lib/schemas'
import { hashPassword } from '@/lib/auth/password'
import { getSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

export async function getMembers(search?: string) {
  const session = await getSession()
  if (!session) return []
  
  return await prisma.user.findMany({
    where: search ? {
      OR: [
        { nama: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } }
      ]
    } : undefined,
    include: { role: true },
    orderBy: { createdAt: 'desc' }
  })
}

export async function createMember(formData: FormData) {
  try {
    const session = await getSession()
    if (session?.role !== 'admin') throw new Error('Unauthorized')

    const data = Object.fromEntries(formData.entries())
    const parsed = memberSchema.parse(data)
    
    // Get Role ID
    const role = await prisma.role.findUnique({ where: { name: parsed.roleName } })
    if (!role) throw new Error('Role tidak valid')

    const hashedPassword = await hashPassword(parsed.password || 'password123')

    await prisma.user.create({
      data: {
        nama: parsed.nama,
        username: parsed.username,
        email: parsed.email || null,
        no_telepon: parsed.no_telepon as string,
        password_hash: hashedPassword,
        roleId: role.id,
        status: 'aktif'
      }
    })

    revalidatePath('/dashboard/anggota')
    return { success: true }
  } catch (error: any) {
    if (error.name === 'ZodError') {
      try {
        const issues = JSON.parse(error.message)
        return { error: issues[0]?.message || 'Input tidak valid' }
      } catch (e) {
        return { error: 'Input tidak valid' }
      }
    }
    return { error: error.message || 'Gagal membuat anggota' }
  }
}

export async function updateMemberStatus(userId: string, newStatus: string) {
  const session = await getSession()
  if (session?.role !== 'admin') throw new Error('Unauthorized')

  await prisma.user.update({
    where: { id: userId },
    data: { status: newStatus }
  })
  revalidatePath('/dashboard/anggota')
}

export async function updateBulkMemberStatus(userIds: string[], newStatus: string) {
  const session = await getSession()
  if (session?.role !== 'admin') throw new Error('Unauthorized')

  await prisma.user.updateMany({
    where: { id: { in: userIds } },
    data: { status: newStatus }
  })
  revalidatePath('/dashboard/anggota')
}
