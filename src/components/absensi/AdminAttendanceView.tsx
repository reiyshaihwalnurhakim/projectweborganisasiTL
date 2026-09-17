'use client'

import { useRouter } from 'next/navigation'
import { Download, Users, QrCode } from 'lucide-react'
import { formatShortDateId } from '@/lib/utils/date'

export default function AdminAttendanceView({ activities, selectedActivityId, attendances }: { activities: any[], selectedActivityId?: string, attendances?: any[] }) {
  const router = useRouter()
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rekapitulasi Kehadiran</h1>
          <p className="text-sm text-gray-500 mt-1">Pantau dan kelola data kehadiran anggota.</p>
        </div>
        <button 
          onClick={() => window.open(`/api/export?type=absensi&activityId=${selectedActivityId}`, '_blank')}
          disabled={!selectedActivityId}
          className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Kegiatan</label>
        <select 
          className="w-full sm:w-96 border-gray-300 text-gray-900 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border outline-none"
          value={selectedActivityId || ''}
          onChange={(e) => router.push(`?activityId=${e.target.value}`)}
        >
          <option value="">-- Pilih Kegiatan --</option>
          {activities.map(a => (
            <option key={a.id} value={a.id}>{a.title} ({new Date(a.date).toLocaleDateString()})</option>
          ))}
        </select>
      </div>

      {selectedActivityId ? (
         <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
               <div>
                  <h3 className="font-semibold text-gray-900">Tabel Daftar Hadir</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Menampilkan status absen anggota secara real-time.</p>
               </div>
               <a 
                 href={`/dashboard/absensi/qr/${selectedActivityId}`} 
                 target="_blank" 
                 className="bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2 shadow-sm"
               >
                 <QrCode className="w-4 h-4" /> Tampilkan Proyektor QR
               </a>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
               <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50">
                     <tr>
                        <th className="px-6 py-3 font-semibold text-gray-600">Nama Anggota</th>
                        <th className="px-6 py-3 font-semibold text-gray-600">Waktu Absen</th>
                        <th className="px-6 py-3 font-semibold text-gray-600">Status</th>
                        <th className="px-6 py-3 font-semibold text-gray-600">Catatan</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {attendances && attendances.length > 0 ? (
                        attendances.map((att: any) => (
                           <tr key={att.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 font-medium text-gray-900">{att.user.nama}</td>
                              <td className="px-6 py-4 text-gray-600">{att.checkInAt ? new Date(att.checkInAt).toLocaleString('id-ID') : '-'}</td>
                              <td className="px-6 py-4">
                                 <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    att.status === 'HADIR' ? 'bg-green-100 text-green-700' :
                                    att.status === 'IZIN' ? 'bg-yellow-100 text-yellow-700' :
                                    att.status === 'SAKIT' ? 'bg-red-100 text-red-700' :
                                    'bg-red-100 text-red-700'
                                 }`}>
                                    {att.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-gray-500">{att.note || '-'}</td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                              Belum ada anggota yang melakukan absensi pada kegiatan ini.
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-white border border-gray-100 rounded-xl shadow-sm">
          Silakan pilih kegiatan di atas untuk melihat data rekapitulasi.
        </div>
      )}
    </div>
  )
}
