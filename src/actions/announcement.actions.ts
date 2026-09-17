'use server'

import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

export async function createAnnouncement(formData: FormData) {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'admin' && session.role !== 'pengurus')) {
      throw new Error('Unauthorized')
    }

    const title = formData.get('title') as string
    const content = formData.get('content') as string

    if (!title || !content) {
      throw new Error('Judul dan isi tidak boleh kosong')
    }

    await prisma.announcement.create({
      data: {
        title,
        content,
        authorId: session.userId
      }
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Gagal membuat pengumuman' }
  }
}
