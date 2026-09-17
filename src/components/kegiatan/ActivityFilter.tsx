'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

const statusOptions = [
  { id: 'ALL', label: 'Semua Status' },
  { id: 'UPCOMING', label: 'Akan Datang' },
  { id: 'ONGOING', label: 'Berlangsung' },
  { id: 'COMPLETED', label: 'Selesai' },
  { id: 'CANCELLED', label: 'Dibatalkan' },
]

export default function ActivityFilter({ currentStatus, currentSearch }: { currentStatus: string, currentSearch: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-3 rounded-xl shadow-sm border border-gray-100">
      <div className="min-w-[200px]">
        <select 
          value={currentStatus || 'ALL'}
          onChange={(e) => updateFilter('status', e.target.value === 'ALL' ? '' : e.target.value)}
          className="w-full border-gray-300 text-gray-900 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 p-2.5 border outline-none text-sm font-medium"
        >
          {statusOptions.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          defaultValue={currentSearch}
          onChange={(e) => updateFilter('q', e.target.value)}
          placeholder="Cari nama acara..." 
          className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border-gray-200 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none text-gray-900"
        />
      </div>
    </div>
  )
}
