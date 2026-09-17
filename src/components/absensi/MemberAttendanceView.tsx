'use client'

import { formatShortDateId } from '@/lib/utils/date'
import { submitAttendance } from '@/actions/attendances.actions'
import { Calendar, Clock, MapPin, CheckCircle, AlertTriangle, QrCode } from 'lucide-react'
import Link from 'next/link'

export default function MemberAttendanceView({ ongoingActivities, history }: { ongoingActivities: any[], history: any[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kehadiran Saya</h1>
        <p className="text-sm text-gray-500 mt-1">Catat absensi kegiatan dan pantau riwayat kehadiran Anda.</p>
      </div>

      <div className="bg-red-600 text-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
         <div>
            <h2 className="text-xl font-bold mb-2">Absensi Cepat via QR Code</h2>
            <p className="text-red-100 text-sm max-w-md">Kini Anda bisa melakukan check-in instan dengan men-scan QR Code yang ditampilkan di layar proyektor kegiatan.</p>
         </div>
         <Link href="/dashboard/absensi/scan" className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-50 transition-colors shrink-0 shadow-sm">
            <QrCode className="w-5 h-5" /> Buka Kamera Scanner
         </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Kegiatan Hari Ini</h2>
        {ongoingActivities.length > 0 ? (
          ongoingActivities.map(activity => {
            const myAttendance = activity.attendances?.[0]
            
            return (
              <div key={activity.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-900 text-lg">{activity.title}</h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-2"><Calendar className="w-4 h-4"/> {formatShortDateId(activity.date)}</span>
                      <span className="flex items-center gap-2"><Clock className="w-4 h-4"/> {activity.startTime} - {activity.endTime}</span>
                      <span className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {activity.location}</span>
                    </div>
                  </div>
                  
                  <div>
                    {myAttendance ? (
                       <div className="bg-green-50 border border-green-100 px-4 py-3 rounded-lg flex items-center gap-3">
                         <CheckCircle className="w-5 h-5 text-green-600" />
                         <div>
                           <div className="font-semibold text-green-700">Telah Diabsen: {myAttendance.status}</div>
                           <div className="text-xs text-green-600">Jam: {new Date(myAttendance.checkInAt).toLocaleTimeString()}</div>
                         </div>
                       </div>
                    ) : (
                      <form className="flex gap-2" action={async (formData) => {
                         const status = formData.get('status') as string
                         await submitAttendance(activity.id, status)
                      }}>
                        <button type="submit" name="status" value="HADIR" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">
                          Hadir
                        </button>
                        <button type="submit" name="status" value="IZIN" className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-100">
                          Izin
                        </button>
                        <button type="submit" name="status" value="SAKIT" className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
                          Sakit
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-500 flex flex-col items-center">
            <AlertTriangle className="w-8 h-8 text-gray-400 mb-2" />
            Tidak ada kegiatan yang sedang berlangsung saat ini.
          </div>
        )}
      </div>

      <div className="space-y-4 pt-6">
        <h2 className="text-lg font-semibold text-gray-900">Riwayat Kehadiran Anda</h2>
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-600">Kegiatan</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Tanggal</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.activity.title}</td>
                  <td className="px-6 py-4 text-gray-600">{formatShortDateId(item.activity.date)}</td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">{item.status}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{item.note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
