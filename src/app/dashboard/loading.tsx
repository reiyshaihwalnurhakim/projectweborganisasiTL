import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      <p className="text-sm font-medium text-gray-500 animate-pulse">Memuat data organisasi...</p>
    </div>
  )
}
