import QRDisplay from '@/components/absensi/QRDisplay'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export default async function QRPage(props: { params: Promise<{ activityId: string }> }) {
  const params = await props.params
  const session = await getSession()
  if (!session || (session.role !== 'admin' && session.role !== 'pengurus')) {
    redirect('/dashboard/absensi')
  }

  const activity = await prisma.activity.findUnique({ where: { id: params.activityId } })
  if (!activity) return <div>Kegiatan tidak ditemukan</div>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
           <h1 className="text-3xl font-bold text-gray-900">{activity.title}</h1>
           <p className="text-gray-500 mt-2">{new Date(activity.date).toLocaleDateString('id-ID')} • {activity.location}</p>
        </div>
        
        <QRDisplay activityId={params.activityId} />
      </div>
    </div>
  )
}
