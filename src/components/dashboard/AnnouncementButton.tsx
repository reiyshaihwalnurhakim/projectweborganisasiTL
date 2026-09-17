'use client'

import { useState } from 'react'
import AnnouncementFormModal from './AnnouncementFormModal'

export default function AnnouncementButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className="text-sm text-blue-600 font-medium hover:underline px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
        + Tulis Pengumuman
      </button>
      
      <AnnouncementFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
