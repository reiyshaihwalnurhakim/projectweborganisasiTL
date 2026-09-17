'use server'

import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { hashPassword } from '@/lib/auth/password'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  try {
    const session = await getSession()
    if (!session) throw new Error('Unauthorized')

    const nama = formData.get('nama') as string
    const email = formData.get('email') as string
    const no_telepon = formData.get('no_telepon') as string
    const newPassword = formData.get('newPassword') as string

    const dataToUpdate: any = {
      nama,
      email,
      no_telepon,
    }

    if (newPassword && newPassword.trim().length > 0) {
      if (newPassword.length < 6) {
        throw new Error('Password baru minimal 6 karakter')
      }
      dataToUpdate.password_hash = await hashPassword(newPassword)
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: dataToUpdate
    })

    revalidatePath('/dashboard/pengaturan')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Gagal memperbarui profil' }
  }
}
