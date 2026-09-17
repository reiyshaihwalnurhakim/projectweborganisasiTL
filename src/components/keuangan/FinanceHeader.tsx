'use client'

import { useState } from 'react'
import { Plus, FileText } from 'lucide-react'
import TransactionFormModal from './TransactionFormModal'

export default function FinanceHeader({ canManage }: { canManage: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Keuangan Organisasi</h1>
          <p className="text-sm text-gray-500 mt-1">Transparansi arus kas dan catatan transaksi.</p>
        </div>
        {canManage && (
          <div className="flex gap-2">
            <a href="/api/export?type=keuangan" className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Laporan
            </a>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Catat Transaksi
            </button>
          </div>
        )}
      </div>

      <TransactionFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
