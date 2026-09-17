import { getSession } from '@/lib/auth/session'
import { getFinancialSummary, getTransactions } from '@/actions/finance.actions'
import { formatRupiah } from '@/lib/utils/currency'
import { ArrowDownRight, ArrowUpRight, Wallet, FileText } from 'lucide-react'
import TransactionTable from '@/components/keuangan/TransactionTable'
import FinanceHeader from '@/components/keuangan/FinanceHeader'

export default async function KeuanganPage(props: { searchParams: Promise<{ type?: string }> }) {
  const searchParams = await props.searchParams
  const session = await getSession()
  const canManage = session?.role === 'admin' || session?.role === 'pengurus'
  
  const filterType = searchParams.type || 'ALL'
  
  const summary = await getFinancialSummary()
  const rawTransactions = await getTransactions(filterType)
  
  // Convert Prisma Decimal to number to avoid Next.js serialization error
  const transactions = rawTransactions.map(t => ({
    ...t,
    amount: Number(t.amount)
  }))

  return (
    <div className="space-y-6">
      <FinanceHeader canManage={canManage} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-600 p-5 rounded-xl shadow-sm text-white">
          <div className="flex justify-between items-start">
            <p className="text-blue-100 font-medium">Saldo Kas Saat Ini</p>
            <Wallet className="w-5 h-5 text-blue-200" />
          </div>
          <p className="text-3xl font-bold mt-2">{formatRupiah(summary.balance)}</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-sm font-medium">Total Pemasukan</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatRupiah(summary.income)}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <ArrowDownRight className="w-4 h-4" />
            <span className="text-sm font-medium">Total Pengeluaran</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatRupiah(summary.expense)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         <TransactionTable transactions={transactions} currentFilter={filterType} canManage={canManage} />
      </div>
    </div>
  )
}
