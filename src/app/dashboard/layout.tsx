import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  // Double check server-side proteksi (walau sudah di-handle middleware)
  if (!session) {
    redirect('/login')
  }

  // Fetch full user data (opsional, jika butuh nama asli & foto)
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { username: true, nama: true, role: { select: { name: true } }, foto: true },
  })

  if (!user) {
    // Jika session valid tapi user tidak ada di DB (misal habis ganti DB ke Supabase),
    // kita harus menghapus cookie lama agar tidak terjadi infinite redirect loop.
    redirect('/api/auth/logout')
  }

  const userData = {
    username: user.username,
    nama: user.nama,
    role: user.role.name,
    foto: user.foto,
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <Sidebar userRole={userData.role} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 transition-all duration-300">
        <TopNav user={userData} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
