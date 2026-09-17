'use client'

import { useState } from 'react'
import { createTransaction } from '@/actions/finance.actions'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

const INCOME_CATEGORIES = ['IURAN', 'DONASI', 'SPONSORSHIP', 'LAINNYA']
const EXPENSE_CATEGORIES = ['KEGIATAN', 'OPERASIONAL', 'KONSUMSI', 'PERALATAN', 'TRANSPORTASI', 'LAINNYA']

export default function TransactionFormModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const router = useRouter()
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const categories = type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    
    const result = await createTransaction(formData)
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setLoading(false)
      onClose()
      // router.refresh() sudah di-handle oleh revalidatePath di server action
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Catat Transaksi Baru</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          {/* Type Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
             <label className={`flex-1 text-center py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${type === 'INCOME' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'}`}>
                <input type="radio" name="type" value="INCOME" className="hidden" checked={type === 'INCOME'} onChange={() => setType('INCOME')} />
                Pemasukan
             </label>
             <label className={`flex-1 text-center py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${type === 'EXPENSE' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500'}`}>
                <input type="radio" name="type" value="EXPENSE" className="hidden" checked={type === 'EXPENSE'} onChange={() => setType('EXPENSE')} />
                Pengeluaran
             </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Transaksi</label>
            <input type="date" name="transactionDate" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border text-sm focus:ring-2 focus:ring-red-500 outline-none" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select name="category" required className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border text-sm focus:ring-2 focus:ring-red-500 outline-none">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nominal (Rp)</label>
              <input type="number" name="amount" min="1" required placeholder="0" className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border text-sm focus:ring-2 focus:ring-red-500 outline-none font-mono" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan / Deskripsi</label>
            <textarea name="description" required rows={3} placeholder="Contoh: Pembelian tinta printer" className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none"></textarea>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={loading} className="w-full bg-red-600 text-white rounded-lg py-2.5 font-medium hover:bg-red-700 transition-colors disabled:opacity-70 flex justify-center items-center">
              {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
