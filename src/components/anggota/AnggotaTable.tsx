'use client'

import { useState } from 'react'
import { updateBulkMemberStatus, deleteMembers } from '@/actions/members.actions'
import MemberStatusSelect from './MemberStatusSelect'
import { CheckSquare, Square, Trash2 } from 'lucide-react'

export default function AnggotaTable({ members, isAdmin }: { members: any[], isAdmin: boolean }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isUpdating, setIsUpdating] = useState(false)

  const toggleSelectAll = () => {
    if (selectedIds.length === members.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(members.map(m => m.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleBulkUpdate = async (status: string) => {
    if (selectedIds.length === 0) return
    setIsUpdating(true)
    await updateBulkMemberStatus(selectedIds, status)
    setSelectedIds([])
    setIsUpdating(false)
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (!confirm('Yakin ingin menghapus permanen anggota terpilih? Ini juga akan menghapus email dan data absen terkait.')) return
    
    setIsUpdating(true)
    const result = await deleteMembers(selectedIds)
    if (result.error) {
      alert(result.error)
    } else {
      setSelectedIds([])
    }
    setIsUpdating(false)
  }

  return (
    <div>
      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-red-50 border-b border-red-100 p-3 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
          <span className="text-sm text-red-800 font-medium">{selectedIds.length} anggota terpilih</span>
          <div className="flex gap-2 items-center">
            <span className="text-xs text-gray-500 mr-2">Aksi:</span>
            <button disabled={isUpdating} onClick={() => handleBulkUpdate('aktif')} className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 disabled:opacity-50">Aktif</button>
            <button disabled={isUpdating} onClick={() => handleBulkUpdate('purna')} className="px-3 py-1 bg-yellow-600 text-white text-xs font-medium rounded hover:bg-yellow-700 disabled:opacity-50">Purna</button>
            <button disabled={isUpdating} onClick={() => handleBulkUpdate('keluar')} className="px-3 py-1 bg-gray-600 text-white text-xs font-medium rounded hover:bg-gray-700 disabled:opacity-50">Keluar</button>
            <div className="w-px h-4 bg-red-200 mx-1"></div>
            <button disabled={isUpdating} onClick={handleBulkDelete} className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"><Trash2 className="w-3 h-3"/> Hapus</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
            <tr>
              {isAdmin && (
                <th className="px-4 py-3 w-12 text-center">
                  <button onClick={toggleSelectAll} className="text-gray-400 hover:text-gray-600">
                    {selectedIds.length === members.length && members.length > 0 ? (
                      <CheckSquare className="w-5 h-5 text-red-600" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </th>
              )}
              <th className="px-6 py-3 font-semibold">User</th>
                <th className="px-6 py-3 font-semibold">Angkatan</th>
              <th className="px-6 py-3 font-semibold">Kontak</th>
              <th className="px-6 py-3 font-semibold">Role</th>
              <th className="px-6 py-3 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map(member => (
              <tr key={member.id} className={`hover:bg-gray-50 ${selectedIds.includes(member.id) ? 'bg-red-50/30' : ''}`}>
                {isAdmin && (
                  <td className="px-4 py-4 text-center">
                    <button onClick={() => toggleSelect(member.id)} className="text-gray-400 hover:text-gray-600">
                      {selectedIds.includes(member.id) ? (
                        <CheckSquare className="w-5 h-5 text-red-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                )}
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{member.nama}</div>
                  <div className="text-gray-500 text-xs mt-0.5">@{member.username}</div>
                </td>
                <td className="px-6 py-4">
                  {member.angkatan ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                      {member.angkatan}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <div>{member.email || '-'}</div>
                  <div className="text-xs">{member.no_telepon || '-'}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="capitalize px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                    {member.role.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <MemberStatusSelect userId={member.id} currentStatus={member.status} isAdmin={isAdmin} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && (
          <div className="text-center py-12 text-gray-500">Tidak ada data anggota ditemukan.</div>
        )}
      </div>
    </div>
  )
}
