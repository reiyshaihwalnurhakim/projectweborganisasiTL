'use server'

import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { createAuditLog } from '@/lib/audit'
import { revalidatePath } from 'next/cache'

export async function generateQrToken(activityId: string) {
  const session = await getSession()
  if (!session || (session.role !== 'admin' && session.role !== 'pengurus')) {
    throw new Error('Unauthorized')
  }

  // Buat string acak (token)
  const token = Math.random().toString(36).substring(2, 15)
  // Kadaluarsa dalam 60 detik
  const expiresAt = new Date(Date.now() + 60 * 1000)

  await prisma.activity.update({
    where: { id: activityId },
    data: { qrToken: token, qrExpiresAt: expiresAt }
  })

  // Audit log bersifat opsional untuk event serutin ini, tapi kita panggil sebagai contoh:
  // createAuditLog({ action: 'GENERATE_QR', entity: 'Activity', entityId: activityId })

  return token
}

export async function scanQrCheckIn(activityId: string, token: string) {
  try {
    const session = await getSession()
    if (!session) throw new Error('Harap login terlebih dahulu')

    const activity = await prisma.activity.findUnique({ where: { id: activityId } })
    if (!activity) throw new Error('Kegiatan tidak ditemukan')

    if (activity.status !== 'ONGOING') {
      throw new Error('Kegiatan belum/tidak sedang berlangsung')
    }

    if (!activity.qrToken || activity.qrToken !== token) {
      throw new Error('QR Code tidak valid')
    }

    if (!activity.qrExpiresAt || new Date() > activity.qrExpiresAt) {
      throw new Error('QR Code sudah kedaluwarsa, silakan scan ulang')
    }

    // Upsert kehadiran
    await prisma.attendance.upsert({
      where: {
        userId_activityId: {
          userId: session.userId,
          activityId: activityId
        }
      },
      update: {
        status: 'HADIR',
        checkInAt: new Date(),
        note: 'Via QR Code'
      },
      create: {
        userId: session.userId,
        activityId: activityId,
        status: 'HADIR',
        checkInAt: new Date(),
        note: 'Via QR Code'
      }
    })

    createAuditLog({ 
      action: 'QR_CHECK_IN', 
      entity: 'Attendance', 
      entityId: activityId,
      details: { method: 'QR', status: 'HADIR' }
    })

    revalidatePath(`/dashboard/absensi`)
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Gagal melakukan check-in' }
  }
}
