'use client'

import { useEffect, useState } from 'react'
import { scanQrCheckIn } from '@/actions/qr.actions'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function AutoCheckIn({ activityId, token }: { activityId: string, token: string }) {
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<{ success?: boolean, error?: string } | null>(null)

  useEffect(() => {
    let isMounted = true
    const run = async () => {
      try {
        const res = await scanQrCheckIn(activityId, token)
        if (isMounted) {
          setResult(res)
          setLoading(false)
        }
      } catch (err: any) {
        if (isMounted) {
          setResult({ error: err.message || 'Gagal memproses check-in' })
          setLoading(false)
        }
      }
    }
    run()
    return () => {
      isMounted = false
    }
  }, [activityId, token])

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm w-full max-w-md animate-in fade-in duration-200">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Memproses Kehadiran...</h2>
        <p className="text-sm text-gray-500">Mohon tunggu sebentar, sedang mencatat absensi Anda.</p>
      </div>
    )
  }

  if (result?.error) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm w-full max-w-md animate-in fade-in duration-200">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
          <XCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Gagal Check-In</h2>
        <p className="text-sm text-red-600 mb-6 bg-red-50 p-3 rounded-lg border border-red-100 font-medium">
          {result.error}
        </p>
        <Link
          href="/dashboard/absensi"
          className="inline-flex items-center justify-center gap-2 w-full bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-red-700 transition-colors"
        >
          Kembali ke Presensi
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm w-full max-w-md animate-in fade-in duration-200">
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
    </div>
  )
}
