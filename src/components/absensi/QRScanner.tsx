'use client'

import { useEffect, useState, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { scanQrCheckIn } from '@/actions/qr.actions'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Camera } from 'lucide-react'

export default function QRScanner() {
  const router = useRouter()
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    let html5QrCode: Html5Qrcode;
    let isMounted = true;

    const startScanner = async () => {
      // Jeda sejenak untuk menghindari race condition di Strict Mode
      await new Promise(resolve => setTimeout(resolve, 100))
      if (!isMounted) return;

      try {
        // Bersihkan kontainer jika ada sisa elemen dari mount sebelumnya
        const reader = document.getElementById('reader')
        if (reader) reader.innerHTML = ''

        html5QrCode = new Html5Qrcode('reader')
        scannerRef.current = html5QrCode
        
        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          onScanSuccess,
          onScanFailure
        )
      } catch (err) {
        if (isMounted) {
          console.error('Kamera gagal dimulai:', err)
          setError('Akses kamera ditolak atau tidak ditemukan.')
        }
      }
    }

    startScanner()

    return () => {
      isMounted = false
      if (scannerRef.current) {
        try {
          scannerRef.current.stop().then(() => {
            scannerRef.current?.clear()
          }).catch(() => {})
        } catch (e) {
          // Abaikan
        }
      }
      // Pembersihan paksa DOM agar tidak menumpuk
      const reader = document.getElementById('reader')
      if (reader) reader.innerHTML = ''
    }
  }, [])

  const onScanSuccess = async (decodedText: string) => {
    // Mencegah pemindaian ganda jika sedang loading
    if (loading || scanResult) return

    setLoading(true)
    
    // Matikan kamera agar tidak terus men-scan
    if (scannerRef.current) {
      scannerRef.current.clear()
    }

    try {
      // Dekode payload JSON dari QR
      // Format yang kita buat: { "activityId": "...", "token": "..." }
      const payload = JSON.parse(decodedText)
      
      if (!payload.activityId || !payload.token) {
        throw new Error('Format QR Code tidak dikenali sistem.')
      }

      // Panggil server action
      const result = await scanQrCheckIn(payload.activityId, payload.token)
      
      if (result.error) {
        setError(result.error)
      } else {
        setScanResult('Berhasil Check-In! Kehadiran Anda telah tercatat.')
        // Arahkan kembali ke halaman absensi setelah beberapa detik
        setTimeout(() => {
          router.push('/dashboard/absensi')
          router.refresh()
        }, 3000)
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memproses QR Code.')
    } finally {
      setLoading(false)
    }
  }

  const onScanFailure = (err: any) => {
    // Abaikan error pemindaian latar belakang
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      {/* Tampilan Sukses */}
      {scanResult && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-8 text-center animate-in fade-in zoom-in w-full">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-green-900 mb-2">Sukses!</h2>
          <p className="text-green-700">{scanResult}</p>
          <p className="text-sm text-green-600 mt-4 animate-pulse">Mengalihkan kembali...</p>
        </div>
      )}

      {/* Tampilan Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-8 text-center animate-in fade-in zoom-in w-full mb-6">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-red-900 mb-2">Peringatan</h2>
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Coba Scan Ulang
          </button>
        </div>
      )}

      {/* Tampilan Scanner */}
      {!scanResult && !error && (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-center gap-2 text-gray-700 font-semibold">
             <Camera className="w-5 h-5" /> Arahkan Kamera ke Layar
          </div>
          <div className="p-4">
            <div id="reader" className="w-full"></div>
            {loading && (
              <div className="mt-4 text-center text-red-600 font-medium animate-pulse">
                Memproses data absensi...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
