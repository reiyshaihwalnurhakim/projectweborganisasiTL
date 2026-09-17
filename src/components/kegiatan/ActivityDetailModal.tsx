import { useState } from 'react'
import { Calendar, Clock, MapPin, UserSquare2, X, Send } from 'lucide-react'
import { formatShortDateId } from '@/lib/utils/date'
import { updateActivityEvaluation } from '@/actions/activities.actions'

export default function ActivityDetailModal({ 
  activity, 
  isOpen, 
  onClose,
  canManage
}: { 
  activity: any, 
  isOpen: boolean, 
  onClose: () => void,
  canManage: boolean
}) {
  const [evalText, setEvalText] = useState(activity.evaluation || '')
  const [isSaving, setIsSaving] = useState(false)
  const isCompleted = activity.status === 'COMPLETED'

  if (!isOpen) return null

  const handleSaveEval = async () => {
    setIsSaving(true)
    await updateActivityEvaluation(activity.id, evalText)
    setIsSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <h2 className="text-lg font-bold text-gray-900">Detail & Evaluasi Kegiatan</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
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

          {/* Evaluasi Section */}
          <div className="pt-4 border-t border-gray-100">
            <span className="text-xs font-medium text-gray-500 block mb-2">Evaluasi Hasil Kegiatan</span>
            {!isCompleted ? (
              <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg text-sm border border-yellow-100">
                Kolom evaluasi dapat diisi setelah kegiatan berstatus <strong>Selesai</strong>.
              </div>
            ) : canManage ? (
              <div className="space-y-3">
                <textarea 
                  rows={4}
                  value={evalText}
                  onChange={(e) => setEvalText(e.target.value)}
                  placeholder="Tuliskan hasil evaluasi, kendala, atau saran perbaikan untuk kegiatan serupa di masa depan..."
                  className="w-full border-gray-300 rounded-lg shadow-sm p-3 border text-sm focus:ring-2 focus:ring-red-500 outline-none text-gray-900 resize-none"
                />
                <button 
                  onClick={handleSaveEval}
                  disabled={isSaving}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> {isSaving ? 'Menyimpan...' : 'Simpan Evaluasi'}
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                  {activity.evaluation || <span className="text-gray-400 italic">Belum ada catatan evaluasi dari penanggung jawab.</span>}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 flex justify-end bg-gray-50/50 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
