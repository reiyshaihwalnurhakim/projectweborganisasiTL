'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteAnnouncement } from '@/actions/announcement.actions'

export default function DeleteAnnouncementButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Hapus pengumuman ini?')) return
    
    setIsDeleting(true)
    try {
      await deleteAnnouncement(id)
    } catch (error) {
      console.error(error)
      alert('Gagal menghapus pengumuman')
    }
    setIsDeleting(false)
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50 disabled:opacity-50 ml-2"
      title="Hapus Pengumuman"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
