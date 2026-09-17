'use client'

import { useState } from 'react'
import { CalendarPlus } from 'lucide-react'
import ActivityFormModal from './ActivityFormModal'

export default function KegiatanHeader({ canManage }: { canManage: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Acara</h1>
          <p className="text-sm text-gray-500 mt-1">Daftar agenda dan acara organisasi.</p>
        </div>
        {canManage && (
          <button onClick={() => setIsModalOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2">
            <CalendarPlus className="w-4 h-4" /> Tambah Acara
          </button>
        )}
      </div>

      <ActivityFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
