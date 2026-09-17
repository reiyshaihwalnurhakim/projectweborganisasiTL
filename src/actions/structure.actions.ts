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

export async function assignMemberToPosition(formData: FormData) {
  const session = await getSession()
  if (session?.role !== 'admin') throw new Error('Unauthorized')

  const positionId = formData.get('positionId') as string
  const userId = formData.get('userId') as string
  const period = formData.get('period') as string

  // Nonaktifkan pejabat sebelumnya
  await prisma.organizationMember.updateMany({
    where: { positionId, isCurrent: true },
    data: { isCurrent: false }
  })

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
  }

  revalidatePath('/dashboard/struktur')
  return { success: true }
}
