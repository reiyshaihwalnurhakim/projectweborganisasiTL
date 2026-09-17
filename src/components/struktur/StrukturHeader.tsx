'use client'

import { useState } from 'react'
import { Settings } from 'lucide-react'
import StructureFormModal from './StructureFormModal'

export default function StrukturHeader({ isAdmin, positions, users }: { isAdmin: boolean, positions: any[], users: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Struktur Organisasi</h1>
          <p className="text-sm text-gray-500 mt-1">Bagan hierarki jabatan dan kepengurusan saat ini.</p>
        </div>
        {isAdmin && (
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
            <Settings className="w-4 h-4" /> Kelola Struktur
          </button>
        )}
      </div>

      <StructureFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} positions={positions} users={users} />
    </>
  )
}
