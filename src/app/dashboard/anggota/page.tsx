import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { getMembers } from '@/actions/members.actions'
import { Search } from 'lucide-react'
import AnggotaHeader from '@/components/anggota/AnggotaHeader'
import AnggotaTable from '@/components/anggota/AnggotaTable'

export default async function AnggotaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await getSession()
  const isAdmin = session?.role === 'admin'

  const params = await searchParams; const query = params?.q || ''
  const members = await getMembers(query)

  return (
    <div className="space-y-6">
      <AnggotaHeader isAdmin={isAdmin} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <form>
              <input 
                name="q"
                defaultValue={query}
                placeholder="Cari nama atau username..." 
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none text-gray-900"
              />
            </form>
          </div>
        </div>

        {/* Table Component */}
        <AnggotaTable members={members} isAdmin={isAdmin} />
      </div>
    </div>
  )
}
