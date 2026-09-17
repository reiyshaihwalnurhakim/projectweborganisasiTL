import QRScanner from '@/components/absensi/QRScanner'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export default async function ScanPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-10 px-4">
       <div className="text-center mb-8">
         <h1 className="text-3xl font-bold text-gray-900">Scan Kehadiran</h1>
         <p className="text-gray-500 mt-2 max-w-sm mx-auto">Izinkan akses kamera dan arahkan lensa ke QR Code yang ditampilkan oleh panitia kegiatan.</p>
       </div>
       
       <QRScanner />
    </div>
  )
}
