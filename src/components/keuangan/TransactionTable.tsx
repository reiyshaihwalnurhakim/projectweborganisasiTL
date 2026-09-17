'use client'

import { useRouter } from 'next/navigation'
import { formatRupiah } from '@/lib/utils/currency'
import { formatShortDateId } from '@/lib/utils/date'
import { ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react'
import { deleteTransaction } from '@/actions/finance.actions'

export default function TransactionTable({ transactions, currentFilter, canManage }: { transactions: any[], currentFilter: string, canManage: boolean }) {
  const router = useRouter()

  return (
    <>
      {/* Toolbar Filter */}
      <div className="p-4 border-b border-gray-100 flex gap-2">
        {['ALL', 'INCOME', 'EXPENSE'].map(f => (
          <button 
            key={f}
            onClick={() => router.push(`?type=${f}`)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md ${currentFilter === f ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            {f === 'ALL' ? 'Semua Transaksi' : f === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-600">Tanggal</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Keterangan</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Kategori</th>
              <th className="px-6 py-3 font-semibold text-gray-600 text-right">Nominal</th>
              {canManage && <th className="px-6 py-3 font-semibold text-gray-600 text-center">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map(t => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{formatShortDateId(t.transactionDate)}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{t.description}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Oleh: {t.creator.nama}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-medium">
                    {t.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap font-medium">
                  {t.type === 'INCOME' ? (
                    <span className="text-green-600 flex items-center justify-end gap-1">
                      <ArrowUpRight className="w-3 h-3" /> +{formatRupiah(t.amount)}
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center justify-end gap-1">
                      <ArrowDownRight className="w-3 h-3" /> -{formatRupiah(t.amount)}
                    </span>
                  )}
                </td>
                {canManage && (
                  <td className="px-6 py-4 text-center">
                    <form action={deleteTransaction.bind(null, t.id)}>
                      <button type="submit" className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Belum ada transaksi yang dicatat.
          </div>
        )}
      </div>
    </>
  )
}
