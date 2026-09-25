import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { formatRupiah } from '@/lib/utils/currency'
import { formatShortDateId } from '@/lib/utils/date'
import { Users, Calendar, Wallet, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import AnnouncementButton from '@/components/dashboard/AnnouncementButton'
import DeleteAnnouncementButton from '@/components/dashboard/DeleteAnnouncementButton'

export default async function DashboardHome() {
  const session = await getSession()
  
  // Ambil data secara paralel (Concurrent fetching) untuk mempercepat loading
  const [
    totalAnggota,
    kegiatanMendatang,
    myAttendances,
    user,
    announcements,
    transactions
  ] = await Promise.all([
    prisma.user.count({ where: { status: 'aktif' } }), // Fix status 'aktif'
    prisma.activity.findMany({
      where: { status: 'UPCOMING' },
      orderBy: { date: 'asc' },
      take: 3
    }),
    prisma.attendance.findMany({
      where: { userId: session?.userId }
    }),
    prisma.user.findUnique({
      where: { id: session?.userId }
    }),
    prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    (session?.role === 'admin' || session?.role === 'pengurus') 
      ? prisma.transaction.groupBy({ by: ['type'], _sum: { amount: true } })
      : Promise.resolve([])
  ])

  // Kalkulasi Saldo Kas
  let saldo = 0
  if (transactions.length > 0) {
    let income = 0, expense = 0
    transactions.forEach(t => {
      if (t.type === 'INCOME') income = Number(t._sum.amount || 0)
      if (t.type === 'EXPENSE') expense = Number(t._sum.amount || 0)
    })
    saldo = income - expense
  }

  // Status Kehadiran Pribadi (Persentase)
  const totalHadir = myAttendances.filter(a => a.status === 'HADIR').length
  const attendancePercentage = myAttendances.length > 0 
    ? Math.round((totalHadir / myAttendances.length) * 100) 
    : 0

  return (
    <div className="space-y-6">
      {/* Hero Section Paskibra */}
      <div className="bg-red-700 rounded-2xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden flex flex-col justify-center min-h-[200px]">
        {/* Dekorasi Latar Belakang */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-black/20 rounded-full blur-2xl translate-y-1/2"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-block px-3 py-1 bg-white/20 border border-white/30 rounded-full text-xs font-semibold tracking-wide mb-4 uppercase shadow-sm">
            Portal Anggota
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Paskibra Satria
          </h1>
          <p className="text-red-100 text-sm sm:text-base leading-relaxed mb-4">
            Selamat datang, <span className="font-semibold text-white">{user?.nama || session?.username}</span>! 
            Sistem informasi ini dirancang untuk mempermudah koordinasi, memantau kedisiplinan, dan membangun kekompakan seluruh jajaran anggota serta pengurus Paskibra.
          </p>
          <div className="flex gap-3 mt-2">
             <Link href="/dashboard/visi-misi" className="bg-white text-red-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
               Lihat Visi & Misi
             </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards - Sembunyikan di layar mobile (hanya tampil di layar medium/md ke atas) */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-gray-50 text-gray-700 rounded-lg flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500 truncate">Total Anggota</p>
            <p className="text-xl font-bold text-gray-900 truncate">{totalAnggota}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-gray-50 text-gray-700 rounded-lg flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500 truncate">Kegiatan Mendatang</p>
            <p className="text-xl font-bold text-gray-900 truncate">{kegiatanMendatang.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-gray-50 text-gray-700 rounded-lg flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500 truncate">Tingkat Kehadiran</p>
            <p className="text-xl font-bold text-gray-900 truncate">{attendancePercentage}%</p>
          </div>
        </div>

        {(session?.role === 'admin' || session?.role === 'pengurus') && (
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-gray-50 text-gray-700 rounded-lg flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-500 truncate">Saldo Kas</p>
              <p className="text-lg font-bold text-gray-900 truncate">{formatRupiah(saldo)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jadwal Terdekat */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-900">Jadwal Terdekat</h2>
            <Link href="/dashboard/kegiatan" className="text-sm text-red-600 font-medium hover:underline">
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
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
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
                 <div key={ann.id} className="bg-white border-l-4 border-red-500 shadow-sm p-4 rounded-r-lg">
                   <div className="flex justify-between items-start mb-1 gap-2">
                     <h3 className="font-semibold text-gray-900">{ann.title}</h3>
                     <div className="flex items-center">
                       <span className="text-xs text-gray-400 shrink-0">{new Date(ann.createdAt).toLocaleDateString('id-ID')}</span>
                       {(session?.role === 'admin' || session?.role === 'pengurus') && (
                         <DeleteAnnouncementButton id={ann.id} />
                       )}
                     </div>
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
