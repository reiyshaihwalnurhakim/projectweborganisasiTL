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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Selamat Datang, {session?.nama} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Ini adalah ringkasan informasi organisasi Anda hari ini.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Anggota</p>
            <p className="text-2xl font-bold text-gray-900">{totalAnggota}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Kegiatan Mendatang</p>
            <p className="text-2xl font-bold text-gray-900">{kegiatanMendatang.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tingkat Kehadiran</p>
            <p className="text-2xl font-bold text-gray-900">{attendancePercentage}%</p>
          </div>
        </div>

        {(session?.role === 'admin' || session?.role === 'pengurus') && (
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Saldo Kas</p>
              <p className="text-lg font-bold text-gray-900">{formatRupiah(saldo)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Jadwal Terdekat */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-900">Jadwal Terdekat</h2>
            <Link href="/dashboard/kegiatan" className="text-sm text-blue-600 font-medium hover:underline">
              Lihat Semua
            </Link>
          </div>
          <div className="divide-y divide-gray-50 p-2">
            {kegiatanMendatang.length > 0 ? (
              kegiatanMendatang.map(keg => (
                <div key={keg.id} className="p-4 flex gap-4 items-start">
                  <div className="bg-blue-50 text-blue-700 rounded-lg p-2 text-center min-w-[60px]">
                    <div className="text-xs font-semibold uppercase">{new Date(keg.date).toLocaleDateString('id-ID', { month: 'short' })}</div>
                    <div className="text-xl font-bold">{new Date(keg.date).getDate()}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{keg.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{formatShortDateId(keg.date)} • {keg.startTime} WIB</p>
                    <p className="text-sm text-gray-500 mt-0.5">{keg.location}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">Tidak ada jadwal terdekat.</div>
            )}
          </div>
        </div>

        {/* Pengumuman Placeholder */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-900">Papan Pengumuman</h2>
            {(session?.role === 'admin' || session?.role === 'pengurus') && (
              <AnnouncementButton />
            )}
          </div>
          <div className="p-6 flex-1 bg-gray-50/50">
            <div className="space-y-4">
               <div className="bg-white border-l-4 border-blue-500 shadow-sm p-4 rounded-r-lg">
                 <div className="flex justify-between items-start mb-1">
                   <h3 className="font-semibold text-gray-900">Selamat Datang di Sistem Baru!</h3>
                   <span className="text-xs text-gray-400">Baru saja</span>
                 </div>
                 <p className="text-sm text-gray-600">Sistem Manajemen Organisasi V1.0 telah resmi diluncurkan. Harap seluruh anggota melengkapi profil dan mengecek kalender.</p>
               </div>
               
               <div className="bg-white border-l-4 border-yellow-500 shadow-sm p-4 rounded-r-lg">
                 <div className="flex justify-between items-start mb-1">
                   <h3 className="font-semibold text-gray-900">Pengingat Iuran Rutin</h3>
                   <span className="text-xs text-gray-400">Kemarin</span>
                 </div>
                 <p className="text-sm text-gray-600">Bagi anggota yang belum melunasi iuran bulan ini, harap segera menyelesaikan administrasi melalui Bendahara.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
