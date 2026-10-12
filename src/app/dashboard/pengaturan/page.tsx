import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import ProfileForm from '@/components/pengaturan/ProfileForm'
import { UserCircle } from 'lucide-react'

export default async function PengaturanPage() {
  const session = await getSession()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { role: true }
  })

  if (!user) return null

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Akun</h1>
        <p className="text-sm text-gray-500 mt-1">Perbarui informasi profil dan kata sandi Anda.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
           <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <UserCircle className="w-10 h-10" />
           </div>
           <div>
              <h2 className="text-lg font-bold text-gray-900">{user.nama}</h2>
              <p className="text-sm text-gray-500">@{user.username} • {user.role.name.toUpperCase()}</p>
           </div>
        </div>
        <div className="p-6">
          <ProfileForm user={user} />
        </div>
      </div>

      {session.role === 'admin' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">Aktivitas & Log Sistem</h3>
            <p className="text-sm text-gray-500 mt-0.5">Pantau riwayat audit log dan perubahan data oleh seluruh pengguna.</p>
          </div>
          <div>
            <a
              href="/dashboard/pengaturan/audit-log"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Lihat Riwayat Aktivitas (Audit Log) &rarr;
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
