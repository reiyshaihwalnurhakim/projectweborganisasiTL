'use client'

import { useEffect, useState } from 'react'
import { generateQrToken } from '@/actions/qr.actions'
import { QRCodeSVG } from 'qrcode.react'

export default function QRDisplay({ activityId }: { activityId: string }) {
  const [token, setToken] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState(60)

  useEffect(() => {
    const fetchToken = async () => {
      const newToken = await generateQrToken(activityId)
      setToken(newToken)
      setTimeLeft(60)
    }

    fetchToken()
    const interval = setInterval(fetchToken, 60000)
    const countdown = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000)

    return () => {
      clearInterval(interval)
      clearInterval(countdown)
    }
  }, [activityId])

  if (!token) return <div className="text-center p-12">Generating QR Code...</div>

  // Buat URL yang berisi activityId dan token (atau cukup jadikan payload JSON)
  const qrData = JSON.stringify({ activityId, token })

  return (
    <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="mb-6 p-4 bg-white rounded-xl shadow-sm">
         <QRCodeSVG value={qrData} size={300} level="H" includeMargin />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Scan untuk Absen</h3>
      <p className="text-gray-500">Buka menu "Scan QR" di akun anggota Anda.</p>
      
      <div className="mt-8 bg-red-50 text-red-700 px-4 py-2 rounded-full font-mono text-sm font-semibold animate-pulse">
        QR berubah dalam {timeLeft} detik
      </div>
    </div>
  )
}
