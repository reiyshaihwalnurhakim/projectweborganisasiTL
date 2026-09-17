import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

// Kita asumsikan membuat komponen terpisah agar file tidak terlalu panjang
import MemberAttendanceView from '@/components/absensi/MemberAttendanceView'
import AdminAttendanceView from '@/components/absensi/AdminAttendanceView'

export default async function AbsensiPage(props: { searchParams: Promise<{ activityId?: string }> }) {
  const searchParams = await props.searchParams
  const session = await getSession()
  if (!session) redirect('/login')

  const isAdminOrPengurus = session.role === 'admin' || session.role === 'pengurus'

  if (isAdminOrPengurus) {
    // Ambil daftar kegiatan untuk dropdown filter admin
    const activities = await prisma.activity.findMany({
      orderBy: { date: 'desc' },
      take: 20
    })

    let attendances: any[] = []
    if (searchParams.activityId) {
      attendances = await prisma.attendance.findMany({
        where: { activityId: searchParams.activityId },
        include: { user: { select: { nama: true } } },
        orderBy: { checkInAt: 'desc' }
      })
    }

    return <AdminAttendanceView activities={activities} selectedActivityId={searchParams.activityId} attendances={attendances} />
  } else {
    // Ambil kegiatan yang sedang berlangsung untuk di-absen oleh anggota
    const ongoingActivities = await prisma.activity.findMany({
      where: { status: 'ONGOING' },
      include: {
        attendances: {
          where: { userId: session.userId }
        }
      }
    })
    
    // Ambil riwayat absen si anggota
    const history = await prisma.attendance.findMany({
      where: { userId: session.userId },
      include: { activity: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    return <MemberAttendanceView ongoingActivities={ongoingActivities} history={history} />
  }
}
