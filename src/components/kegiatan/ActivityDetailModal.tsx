import { Calendar, Clock, MapPin, UserSquare2, X } from 'lucide-react'
import { formatShortDateId } from '@/lib/utils/date'

export default function ActivityDetailModal({ 
  activity, 
  isOpen, 
  onClose 
}: { 
  activity: any, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Detail Kegiatan</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{activity.title}</h3>
            <p className="text-sm text-gray-500 mt-1">Dibuat pada {new Date(activity.createdAt).toLocaleDateString('id-ID')}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> Tanggal</span>
              <p className="text-sm font-semibold text-gray-900">{formatShortDateId(activity.date)}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> Waktu</span>
              <p className="text-sm font-semibold text-gray-900">{activity.startTime} - {activity.endTime}</p>
            </div>
            <div className="space-y-1 col-span-2">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> Lokasi</span>
              <p className="text-sm font-semibold text-gray-900">{activity.location}</p>
            </div>
            <div className="space-y-1 col-span-2">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5"><UserSquare2 className="w-3.5 h-3.5"/> Penanggung Jawab (PIC)</span>
              <p className="text-sm font-semibold text-gray-900">{activity.personInCharge}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <span className="text-xs font-medium text-gray-500 block mb-2">Deskripsi Kegiatan</span>
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {activity.description || 'Tidak ada deskripsi tambahan.'}
            </p>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 flex justify-end bg-gray-50/50">
          <button onClick={onClose} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
