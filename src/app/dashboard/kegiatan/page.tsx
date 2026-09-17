import { getActivities } from '@/actions/activities.actions'
import { getSession } from '@/lib/auth/session'
import ActivityCard from '@/components/kegiatan/ActivityCard'
import ActivityFilter from '@/components/kegiatan/ActivityFilter'
import KegiatanHeader from '@/components/kegiatan/KegiatanHeader'
import { CalendarPlus } from 'lucide-react'

export default async function KegiatanPage(props: { searchParams: Promise<{ status?: string, q?: string }> }) {
  const searchParams = await props.searchParams
  const session = await getSession()
  const canManage = session?.role === 'admin' || session?.role === 'pengurus'
  
  const statusFilter = searchParams.status || 'ALL'
  const searchFilter = searchParams.q || ''
  
  const activities = await getActivities(statusFilter, searchFilter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <KegiatanHeader canManage={canManage} />

      {/* Filters */}
      <ActivityFilter currentStatus={statusFilter} currentSearch={searchFilter} />

      {/* Grid Content */}
      {activities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} canManage={canManage} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
          <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
            <CalendarPlus className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900">Tidak ada kegiatan</h3>
          <p className="mt-1 text-sm text-gray-500">Coba ubah filter pencarian Anda.</p>
        </div>
      )}
    </div>
  )
}
