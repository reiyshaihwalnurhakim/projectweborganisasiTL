'use server'

import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { attendanceSchema } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'

export async function submitAttendance(activityId: string, status: string, note?: string) {
  try {
    const session = await getSession()
    if (!session) throw new Error('Tidak memiliki akses')

    // Validasi payload
    const parsed = attendanceSchema.parse({ status, note })

    // Validasi status kegiatan
    const activity = await prisma.activity.findUnique({ where: { id: activityId } })
    if (!activity || activity.status !== 'ONGOING') {
      throw new Error('Kegiatan tidak sedang berlangsung')
    }

    // Upsert absensi (mencegah duplikat dengan unique constraint atau update jika admin ganti)
    await prisma.attendance.upsert({
      where: {
        userId_activityId: {
          userId: session.userId,
          activityId: activityId
        }
      },
      update: {
        status: parsed.status as any,
        note: parsed.note,
        checkInAt: new Date()
      },
      create: {
        userId: session.userId,
        activityId: activityId,
        status: parsed.status as any,
        note: parsed.note,
        checkInAt: new Date()
      }
    })

    revalidatePath('/dashboard/absensi')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Gagal merekam absensi' }
  }
}

export async function updateMemberAttendance(attendanceId: string, status: string, note?: string) {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'admin' && session.role !== 'pengurus')) {
      throw new Error('Tidak memiliki akses')
    }

    await prisma.attendance.update({
      where: { id: attendanceId },
      data: { status: status as any, note }
    })

    revalidatePath('/dashboard/absensi')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Gagal mengubah absensi' }
  }
}

export async function getActivityAttendanceSummary(activityId: string) {
  const attendances = await prisma.attendance.findMany({
    where: { activityId },
    include: { user: { select: { nama: true, username: true } } }
  })

  const stats = {
    HADIR: 0, IZIN: 0, SAKIT: 0, ALPA: 0, TOTAL: attendances.length
  }

  attendances.forEach(a => {
    stats[a.status as keyof typeof stats]++
  })

  return { attendances, stats }
}

export async function exportAttendanceCSV(activityId: string) {
  const { attendances } = await getActivityAttendanceSummary(activityId)
  
  const headers = ['Nama', 'Username', 'Status', 'Waktu Check-in', 'Keterangan']
  const rows = attendances.map(a => [
    `"${a.user.nama}"`,
    `"${a.user.username}"`,
    `"${a.status}"`,
    `"${a.checkInAt ? a.checkInAt.toISOString() : ''}"`,
    `"${a.note || ''}"`
  ].join(','))

  return [headers.join(','), ...rows].join('\n')
}
