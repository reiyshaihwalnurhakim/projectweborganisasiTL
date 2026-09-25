'use server'

import { prisma } from '@/lib/db'
import { activitySchema } from '@/lib/schemas'
import { getSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

export async function getActivities(status?: string, search?: string) {
  return await prisma.activity.findMany({
    where: {
      status: status && status !== 'ALL' ? (status as any) : undefined,
      title: search ? { contains: search, mode: 'insensitive' } : undefined,
    },
    orderBy: { date: 'asc' },
    include: { creator: { select: { nama: true } } }
  })
}

export async function createActivity(formData: FormData) {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'admin' && session.role !== 'pengurus')) {
      throw new Error('Tidak memiliki akses')
    }

    const data = Object.fromEntries(formData.entries())
    const parsed = activitySchema.parse(data)
    
    // Parse date input (YYYY-MM-DD)
    const date = new Date(parsed.date)

    await prisma.activity.create({
      data: {
        title: parsed.title,
        description: parsed.description,
        date: date,
        startTime: parsed.startTime,
        endTime: parsed.endTime,
        location: parsed.location,
        personInCharge: parsed.personInCharge,
        createdBy: session.userId,
      }
    })

    revalidatePath('/dashboard/kegiatan')
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
    return { error: error.message || 'Gagal membuat kegiatan' }
  }
}

export async function updateActivityStatus(id: string, status: string) {
  const session = await getSession()
  if (!session || (session.role !== 'admin' && session.role !== 'pengurus')) {
    throw new Error('Tidak memiliki akses')
  }

  await prisma.activity.update({
    where: { id },
    data: { status: status as any }
  })
  
  revalidatePath('/dashboard/kegiatan')
}

export async function updateActivityEvaluation(id: string, evaluation: string) {
  const session = await getSession()
  if (!session || (session.role !== 'admin' && session.role !== 'pengurus')) {
    throw new Error('Tidak memiliki akses')
  }

  await prisma.activity.update({
    where: { id },
    data: { evaluation }
  })
  
  revalidatePath('/dashboard/kegiatan')
}
