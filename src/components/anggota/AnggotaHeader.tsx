'use client'

import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import MemberFormModal from './MemberFormModal'

export default function AnggotaHeader({ isAdmin }: { isAdmin: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Anggota Organisasi</h1>
          <p className="text-sm text-gray-500 mt-1">Daftar kontak dan status seluruh anggota.</p>
        </div>
        {isAdmin && (
          <button onClick={() => setIsModalOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Tambah Anggota
          </button>
        )}
      </div>

      <MemberFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
