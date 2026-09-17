'use client'

import { useState } from 'react'
import { assignMemberToPosition } from '@/actions/structure.actions'
import { X } from 'lucide-react'

export default function StructureFormModal({ isOpen, onClose, positions, users }: { isOpen: boolean, onClose: () => void, positions: any[], users: any[] }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const result = await assignMemberToPosition(formData)
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setLoading(false)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Penugasan Jabatan</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Jabatan</label>
            <select name="positionId" required className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border text-sm focus:ring-2 focus:ring-red-500 outline-none">
              {positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Anggota yang Ditugaskan</label>
            <select name="userId" className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border text-sm focus:ring-2 focus:ring-red-500 outline-none">
              <option value="">-- Kosongkan (Berhentikan Jabatan) --</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.nama} (@{u.username})</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Periode (Tahun)</label>
            <input type="text" name="period" required defaultValue={new Date().getFullYear().toString()} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border text-sm focus:ring-2 focus:ring-red-500 outline-none" />
          </div>

          <div className="pt-2">
            <button type="submit" disabled={loading} className="w-full bg-red-600 text-white rounded-lg py-2.5 font-medium hover:bg-red-700 transition-colors disabled:opacity-70 flex justify-center items-center">
              {loading ? 'Menyimpan...' : 'Terapkan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
