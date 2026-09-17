'use server'

import { prisma } from '@/lib/db'
import { memberSchema } from '@/lib/schemas'
import { hashPassword } from '@/lib/auth/password'
import { revalidatePath } from 'next/cache'

export async function getMembers(search?: string) {
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
        status: 'active'
      }
    })

    revalidatePath('/dashboard/anggota')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Gagal membuat anggota' }
  }
}

export async function toggleMemberStatus(userId: string, currentStatus: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { status: currentStatus === 'active' ? 'inactive' : 'active' }
  })
  revalidatePath('/dashboard/anggota')
}
