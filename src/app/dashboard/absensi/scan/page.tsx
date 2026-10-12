import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { scanQrCheckIn } from '@/actions/qr.actions'
import { CheckCircle, XCircle, Smartphone, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function ScanPage(props: { searchParams: Promise<{ activityId?: string, token?: string }> }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const searchParams = await props.searchParams
  const activityId = searchParams?.activityId
  const token = searchParams?.token
  let autoProcessResult = null

  if (activityId && token) {
    autoProcessResult = await scanQrCheckIn(activityId, token)
  }

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center py-8 px-4">
      {autoProcessResult ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm w-full max-w-md animate-in fade-in duration-200">
          {autoProcessResult.error ? (
            <>
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                <XCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Gagal Check-In</h2>
              <p className="text-sm text-red-600 mb-6 bg-red-50 p-3 rounded-lg border border-red-100">
                {autoProcessResult.error}
              </p>
              <Link
                href="/dashboard/absensi"
                className="inline-flex items-center justify-center gap-2 w-full bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                Kembali ke Presensi
              </Link>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Berhasil Check-In!</h2>
              <p className="text-sm text-gray-600 mb-6">
                Kehadiran Anda telah sukses tercatat dalam sistem organisasi.
              </p>
              <Link
                href="/dashboard/absensi"
                className="inline-flex items-center justify-center gap-2 w-full bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-black transition-colors"
              >
                Lihat Riwayat Presensi
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm w-full max-w-md text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
            <Smartphone className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Presensi via QR Code</h1>
            <p className="text-sm text-gray-500 mt-1">
              Gunakan kamera ponsel bawaan atau Google Lens untuk memindai kode kegiatan secara instan.
            </p>
          </div>

          <div className="text-left bg-gray-50 rounded-xl p-4 space-y-3 text-sm text-gray-700 border border-gray-100">
            <div className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
              <p>Pastikan Anda sudah login di browser ponsel Anda.</p>
            </div>
            <div className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
              <p>Buka aplikasi <strong>Kamera Bawaan HP</strong> atau <strong>Google Lens</strong>.</p>
            </div>
            <div className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
              <p>Arahkan kamera ke QR Code kegiatan, lalu klik tautan notifikasi yang muncul di layar.</p>
            </div>
          </div>

          <Link
            href="/dashboard/absensi"
            className="inline-flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Halaman Absensi
          </Link>
        </div>
      )}
    </div>
  )
}
