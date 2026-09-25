import QRScanner from '@/components/absensi/QRScanner'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { scanQrCheckIn } from '@/actions/qr.actions'
import { CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

export default async function ScanPage({ searchParams }: { searchParams: { activityId?: string, token?: string } }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { activityId, token } = searchParams
  let autoProcessResult = null

  if (activityId && token) {
    autoProcessResult = await scanQrCheckIn(activityId, token)
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-10 px-4">
       <div className="text-center mb-8">
         <h1 className="text-3xl font-bold text-gray-900">Scan Kehadiran</h1>
         <p className="text-gray-500 mt-2 max-w-sm mx-auto">Izinkan akses kamera dan arahkan lensa ke QR Code yang ditampilkan oleh panitia kegiatan.</p>
       </div>
       
       {autoProcessResult ? (
         <div className="bg-white border border-gray-100 rounded-xl p-8 text-center shadow-sm w-full max-w-md">
           {autoProcessResult.error ? (
             <>
               <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
               <h2 className="text-xl font-bold text-gray-900 mb-2">Gagal Check-In</h2>
               <p className="text-red-600 mb-6">{autoProcessResult.error}</p>
               <Link href="/dashboard/absensi/scan" className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700">
                 Coba Scan Lagi
               </Link>
             </>
           ) : (
             <>
               <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
               <h2 className="text-xl font-bold text-gray-900 mb-2">Berhasil Check-In!</h2>
               <p className="text-green-700 mb-6">Kehadiran Anda telah tercatat dalam sistem.</p>
               <Link href="/dashboard/absensi" className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200">
                 Kembali ke Riwayat
               </Link>
             </>
           )}
         </div>
       ) : (
         <QRScanner />
       )}
    </div>
  )
}
