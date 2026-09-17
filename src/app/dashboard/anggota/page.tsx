import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { getMembers, toggleMemberStatus } from '@/actions/members.actions'
import { Search, Ban, CheckCircle } from 'lucide-react'
import AnggotaHeader from '@/components/anggota/AnggotaHeader'

export default async function AnggotaPage({ searchParams }: { searchParams: { q?: string } }) {
  const session = await getSession()
  if (session?.role !== 'admin') redirect('/dashboard')

  const query = searchParams?.q || ''
  const members = await getMembers(query)

  return (
    <div className="space-y-6">
      <AnggotaHeader />

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
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </form>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-semibold">User</th>
                <th className="px-6 py-3 font-semibold">Kontak</th>
                <th className="px-6 py-3 font-semibold">Role</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map(member => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{member.nama}</div>
                    <div className="text-gray-500 text-xs mt-0.5">@{member.username}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div>{member.email || '-'}</div>
                    <div className="text-xs">{member.no_telepon || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">
                      {member.role.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {member.status === 'active' ? (
                      <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> Aktif
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-red-600 text-xs font-medium">
                        <Ban className="w-3.5 h-3.5" /> Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={toggleMemberStatus.bind(null, member.id, member.status)}>
                       <button type="submit" className="text-blue-600 text-xs hover:underline">
                         Toggle Status
                       </button>
                    </form>
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
    </div>
  )
}
