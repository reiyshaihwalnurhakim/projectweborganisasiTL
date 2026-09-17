'use server'

import { verifyPassword } from '@/lib/auth/password'
import { createSession, deleteSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type FormState = {
  error?: string;
  success?: boolean;
}

export async function loginAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const rememberMe = formData.get('remember') === 'on'

  if (!username || !password) {
    return { error: 'Username dan password wajib diisi.' }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { role: true },
    })

    if (!user) {
      return { error: 'Username atau password salah.' }
    }

    if (user.status !== 'active') {
      return { error: 'Akun Anda telah dinonaktifkan. Silakan hubungi admin.' }
    }

    const isPasswordValid = await verifyPassword(password, user.password_hash)
    if (!isPasswordValid) {
      return { error: 'Username atau password salah.' }
    }

    await createSession({
      userId: user.id,
      username: user.username,
      role: user.role.name,
    }, rememberMe)

  } catch (error) {
    console.error('Login error:', error)
    return { error: 'Terjadi kesalahan sistem. Silakan coba lagi.' }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function logoutAction() {
  await deleteSession()
  redirect('/login')
}
