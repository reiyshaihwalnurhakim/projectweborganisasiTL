'use server'

import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

export async function getOrganizationTree() {
  // Ambil semua posisi beserta member-nya yang aktif
  const positions = await prisma.position.findMany({
    include: {
      organizationMembers: {
        where: { isCurrent: true },
        include: { user: true }
      }
    },
    orderBy: { order: 'asc' }
  })

  // Membangun Tree (Hierarki)
  const map = new Map()
  positions.forEach(p => map.set(p.id, { ...p, children: [] }))

  const tree: any[] = []
  positions.forEach(p => {
    if (p.parentId) {
      const parent = map.get(p.parentId)
      if (parent) {
        parent.children.push(map.get(p.id))
      }
    } else {
      tree.push(map.get(p.id))
    }
  })

  return tree
}

export async function assignMemberToPosition(formData: FormData): Promise<{success?: boolean; error?: string}> {
  try {
    const session = await getSession()
    if (session?.role !== 'admin') throw new Error('Unauthorized')

    const positionId = formData.get('positionId') as string
    const userId = formData.get('userId') as string
    const period = formData.get('period') as string

    // Dapatkan pejabat lama
    const oldMembers = await prisma.organizationMember.findMany({
      where: { positionId, isCurrent: true },
      select: { userId: true }
    })

    // Nonaktifkan pejabat sebelumnya
    await prisma.organizationMember.updateMany({
      where: { positionId, isCurrent: true },
      data: { isCurrent: false }
    })

    // Update Role untuk pejabat lama (kembali jadi anggota jika tidak punya jabatan aktif lain)
    for (const old of oldMembers) {
      if (old.userId === userId) continue;
      const hasOtherPosition = await prisma.organizationMember.findFirst({
        where: { userId: old.userId, isCurrent: true }
      })
      if (!hasOtherPosition) {
        const userRec = await prisma.user.findUnique({ where: { id: old.userId }, include: { role: true } })
        if (userRec && userRec.role.name !== 'admin') {
          const anggotaRole = await prisma.role.findUnique({ where: { name: 'anggota' } })
          if (anggotaRole) {
             await prisma.user.update({ where: { id: old.userId }, data: { roleId: anggotaRole.id } })
          }
        }
      }
    }

    // Tetapkan pejabat baru
    if (userId) {
      await prisma.organizationMember.create({
        data: {
          userId,
          positionId,
          period,
          isCurrent: true
        }
      })
      
      // Update Role pejabat baru jadi pengurus
      const userRec = await prisma.user.findUnique({ where: { id: userId }, include: { role: true } })
      if (userRec && userRec.role.name === 'anggota') {
        const pengurusRole = await prisma.role.findUnique({ where: { name: 'pengurus' } })
        if (pengurusRole) {
           await prisma.user.update({ where: { id: userId }, data: { roleId: pengurusRole.id } })
        }
      }
    }

    revalidatePath('/dashboard/struktur')
    revalidatePath('/dashboard/anggota')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Gagal mengubah struktur' }
  }
}

export async function createPosition(formData: FormData): Promise<{success?: boolean; error?: string}> {
  try {
    const session = await getSession()
    if (session?.role !== 'admin') throw new Error('Unauthorized')

    const name = formData.get('name') as string
    const parentId = formData.get('parentId') as string
    const description = formData.get('description') as string

    if (!name) throw new Error('Nama jabatan wajib diisi')

    const maxOrderPos = await prisma.position.findFirst({ orderBy: { order: 'desc' } })
    const order = maxOrderPos ? maxOrderPos.order + 1 : 0

    await prisma.position.create({
      data: {
        name,
        description,
        parentId: parentId || null,
        order
      }
    })

    revalidatePath('/dashboard/struktur')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Gagal membuat jabatan' }
  }
}
