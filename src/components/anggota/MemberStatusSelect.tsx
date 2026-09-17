'use client'

import { updateMemberStatus } from '@/actions/members.actions'
import { useTransition } from 'react'

export default function MemberStatusSelect({ userId, currentStatus, isAdmin }: { userId: string, currentStatus: string, isAdmin: boolean }) {
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    startTransition(() => {
      updateMemberStatus(userId, newStatus)
    })
  }

  // Define badge colors based on status
  const getColor = (status: string) => {
    switch (status) {
      case 'aktif': return 'text-green-700 bg-green-50 border-green-200'
      case 'purna': return 'text-yellow-700 bg-yellow-50 border-yellow-200'
      case 'keluar': return 'text-red-700 bg-red-50 border-red-200'
      default: return 'text-gray-700 bg-gray-50 border-gray-200'
    }
  }

  const normalizedStatus = currentStatus === 'active' ? 'aktif' : currentStatus === 'inactive' ? 'keluar' : currentStatus

  if (!isAdmin) {
    return (
      <span className={`inline-block text-xs font-medium px-2 py-1 rounded border capitalize ${getColor(normalizedStatus)}`}>
        {normalizedStatus}
      </span>
    )
  }

  return (
    <select 
      value={normalizedStatus}
      onChange={handleChange}
      disabled={isPending}
      className={`text-xs font-medium px-2 py-1 rounded border outline-none cursor-pointer disabled:opacity-50 ${getColor(normalizedStatus)}`}
    >
      <option value="aktif">Aktif</option>
      <option value="purna">Purna</option>
      <option value="keluar">Keluar</option>
    </select>
  )
}
