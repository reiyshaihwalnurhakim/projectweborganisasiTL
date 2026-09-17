'use client'

import { useState } from 'react'
import { formatShortDateId } from '@/lib/utils/date'
import { updateActivityStatus } from '@/actions/activities.actions'
import { Calendar, Clock, MapPin, UserSquare2, ChevronRight } from 'lucide-react'
import ActivityDetailModal from './ActivityDetailModal'

const statusConfig = {
  UPCOMING: { color: 'bg-blue-50 text-blue-700', label: 'Akan Datang' },
  ONGOING: { color: 'bg-green-50 text-green-700', label: 'Sedang Berlangsung' },
  COMPLETED: { color: 'bg-gray-100 text-gray-600', label: 'Selesai' },
  CANCELLED: { color: 'bg-red-50 text-red-700', label: 'Dibatalkan' },
}

export default function ActivityCard({ activity, canManage }: { activity: any, canManage: boolean }) {
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const badge = statusConfig[activity.status as keyof typeof statusConfig]

  return (
    <>
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col h-full">
      {/* Card Header */}
      <div className="p-5 border-b border-gray-50 flex justify-between items-start">
        <div className="space-y-1 pr-4">
          <h3 className="font-semibold text-gray-900 leading-tight">{activity.title}</h3>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badge.color}`}>
            {badge.label}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
          <span>{formatShortDateId(activity.date)}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-gray-400 shrink-0" />
          <span>{activity.startTime} - {activity.endTime} WIB</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="truncate">{activity.location}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600 pt-2 border-t border-gray-50">
          <UserSquare2 className="w-4 h-4 text-gray-400 shrink-0" />
          <span>PIC: <span className="font-medium text-gray-900">{activity.personInCharge}</span></span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 bg-gray-50 rounded-b-xl flex justify-between items-center">
        {canManage ? (
           <select 
             className="text-xs font-medium bg-white border border-gray-200 rounded px-2 py-1 outline-none text-gray-700 cursor-pointer hover:border-blue-400"
             defaultValue={activity.status}
             onChange={async (e) => {
                await updateActivityStatus(activity.id, e.target.value)
             }}
           >
             <option value="UPCOMING">Akan Datang</option>
             <option value="ONGOING">Berlangsung</option>
             <option value="COMPLETED">Selesai</option>
             <option value="CANCELLED">Batal</option>
           </select>
        ) : <div/>}
        <button onClick={() => setIsDetailOpen(true)} className="text-sm font-medium text-gray-900 hover:text-blue-600 flex items-center gap-1">
          Detail <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
    
    <ActivityDetailModal 
      activity={activity} 
      isOpen={isDetailOpen} 
      onClose={() => setIsDetailOpen(false)} 
    />
    </>
  )
}
