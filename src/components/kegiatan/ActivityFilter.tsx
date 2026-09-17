'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

const tabs = [
  { id: 'ALL', label: 'Semua' },
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
    <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-2 rounded-xl shadow-sm border border-gray-100">
      <div className="flex overflow-x-auto no-scrollbar gap-1 p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => updateFilter('status', tab.id === 'ALL' ? '' : tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              (currentStatus === tab.id || (tab.id === 'ALL' && currentStatus === ''))
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative p-1 min-w-[250px]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          defaultValue={currentSearch}
          onChange={(e) => updateFilter('q', e.target.value)}
          placeholder="Cari kegiatan..." 
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
    </div>
  )
}
