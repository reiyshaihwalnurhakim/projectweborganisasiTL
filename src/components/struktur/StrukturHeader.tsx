'use client'

import { useState } from 'react'
import { Settings, Plus } from 'lucide-react'
import StructureFormModal from './StructureFormModal'
import PositionFormModal from './PositionFormModal'

export default function StrukturHeader({ isAdmin, positions, users }: { isAdmin: boolean, positions: any[], users: any[] }) {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Struktur Organisasi</h1>
          <p className="text-sm text-gray-500 mt-1">Bagan hierarki jabatan dan kepengurusan saat ini.</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <button onClick={() => setIsPositionModalOpen(true)} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Tambah Jabatan
            </button>
            <button onClick={() => setIsAssignModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Kelola Pejabat
            </button>
          </div>
        )}
      </div>

      <StructureFormModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} positions={positions} users={users} />
      <PositionFormModal isOpen={isPositionModalOpen} onClose={() => setIsPositionModalOpen(false)} positions={positions} />
    </>
  )
}
