'use client'

import { useState } from 'react'
import { updateProfile } from '@/actions/user.actions'

export default function ProfileForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })
    
    const formData = new FormData(e.currentTarget)
    const result = await updateProfile(formData)
    
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' })
      // Clear password field
      ;(e.currentTarget.elements.namedItem('newPassword') as HTMLInputElement).value = ''
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {message.text && (
        <div className={`p-3 rounded-lg text-sm font-medium border ${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <input type="text" name="nama" defaultValue={user.nama} required className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username (Tidak bisa diubah)</label>
          <input type="text" defaultValue={user.username} disabled className="w-full border-gray-200 bg-gray-50 text-gray-500 rounded-lg shadow-sm p-2.5 border text-sm outline-none cursor-not-allowed" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
          <input type="text" name="no_telepon" defaultValue={user.no_telepon || ''} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" name="email" defaultValue={user.email || ''} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Ganti Kata Sandi</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi Baru</label>
          <input type="password" name="newPassword" placeholder="Kosongkan jika tidak ingin mengubah sandi" className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-70">
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </form>
  )
}
