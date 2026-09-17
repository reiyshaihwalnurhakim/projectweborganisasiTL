import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { formatRupiah } from '@/lib/utils/currency'
import { formatShortDateId } from '@/lib/utils/date'
import { Users, Calendar, Wallet, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import AnnouncementButton from '@/components/dashboard/AnnouncementButton'

export default async function DashboardHome() {
  const session = await getSession()
  
  // 1. Ambil Total Anggota Aktif
  const totalAnggota = await prisma.user.count({ where: { status: 'active' } })
  
  // 2. Ambil Kegiatan Mendatang
  const kegiatanMendatang = await prisma.activity.findMany({
    where: { status: 'UPCOMING' },
    orderBy: { date: 'asc' },
    take: 3
  })

  // 3. Kalkulasi Saldo Kas
  let saldo = 0
  if (session?.role === 'admin' || session?.role === 'pengurus') {
    const transactions = await prisma.transaction.groupBy({
      by: ['type'],
      _sum: { amount: true }
    })
    let income = 0, expense = 0
    transactions.forEach(t => {
      if (t.type === 'INCOME') income = Number(t._sum.amount || 0)
      if (t.type === 'EXPENSE') expense = Number(t._sum.amount || 0)
    })
    saldo = income - expense
  }

  // 4. Status Kehadiran Pribadi (Persentase)
  const myAttendances = await prisma.attendance.findMany({
    where: { userId: session?.userId }
  })
  const totalHadir = myAttendances.filter(a => a.status === 'HADIR').length
  const attendancePercentage = myAttendances.length > 0 
    ? Math.round((totalHadir / myAttendances.length) * 100) 
    : 0

  const user = await prisma.user.findUnique({
    where: { id: session?.userId }
  })

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Selamat Datang, {user?.nama || session?.username} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Ini adalah ringkasan informasi organisasi Anda hari ini.</p>
      </div>

      {/* KPI Cards - Sembunyikan di layar mobile (hanya tampil di layar medium/md ke atas) */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-500 truncate">Total Anggota</p>
            <p className="text-2xl font-bold text-gray-900 truncate">{totalAnggota}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-500 truncate">Kegiatan Mendatang</p>
            <p className="text-2xl font-bold text-gray-900 truncate">{kegiatanMendatang.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-500 truncate">Tingkat Kehadiran</p>
            <p className="text-2xl font-bold text-gray-900 truncate">{attendancePercentage}%</p>
          </div>
        </div>

        {(session?.role === 'admin' || session?.role === 'pengurus') && (
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-500 truncate">Saldo Kas</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{formatRupiah(saldo)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jadwal Terdekat */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-900">Jadwal Terdekat</h2>
            <Link href="/dashboard/kegiatan" className="text-sm text-blue-600 font-medium hover:underline">
              Lihat Semua
            </Link>
          </div>
          <div className="p-0">
            {kegiatanMendatang.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {kegiatanMendatang.map(keg => (
                  <div key={keg.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-1">{keg.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {formatShortDateId(keg.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        {keg.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-12 text-gray-500">
                Tidak ada jadwal terdekat.
              </div>
            )}
          </div>
        </div>

        {/* Papan Pengumuman */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-900">Papan Pengumuman</h2>
            {(session?.role === 'admin' || session?.role === 'pengurus') && (
              <AnnouncementButton />
            )}
          </div>
          <div className="p-6 flex-1 bg-gray-50/50">
            <div className="space-y-4">
               {announcements.length > 0 ? announcements.map((ann) => (
                 <div key={ann.id} className="bg-white border-l-4 border-blue-500 shadow-sm p-4 rounded-r-lg">
                   <div className="flex justify-between items-start mb-1 gap-2">
                     <h3 className="font-semibold text-gray-900">{ann.title}</h3>
                     <span className="text-xs text-gray-400 shrink-0">{new Date(ann.createdAt).toLocaleDateString('id-ID')}</span>
                   </div>
                   <p className="text-sm text-gray-600 whitespace-pre-line">{ann.content}</p>
                 </div>
               )) : (
                 <div className="text-center p-6 text-gray-500 text-sm">
                   Belum ada pengumuman baru.
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
