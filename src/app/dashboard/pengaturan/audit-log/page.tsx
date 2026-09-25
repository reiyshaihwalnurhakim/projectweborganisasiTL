import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { formatShortDateId } from '@/lib/utils/date'
import { History, Search } from 'lucide-react'

export default async function AuditLogPage() {
  const session = await getSession()
  if (session?.role !== 'admin') redirect('/dashboard')

  const logs = await prisma.auditLog.findMany({
    include: { user: { select: { nama: true, username: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50 // Batasi 50 log terakhir
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <History className="w-6 h-6 text-gray-400" /> Riwayat Aktivitas Sistem
          </h1>
          <p className="text-sm text-gray-500 mt-1">Audit log untuk memantau perubahan data yang sensitif.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-600">Waktu</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Pelaku</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Aksi</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Target Entitas</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    {log.user ? (
                       <span className="font-medium text-gray-900">{log.user.nama}</span>
                    ) : (
                       <span className="italic text-gray-400">Sistem / Guest</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded uppercase">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {log.entity} {log.entityId && <span className="text-xs text-gray-400">({log.entityId.substring(0,8)}...)</span>}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {(() => {
                      if (!log.details) return <span className="text-gray-400">-</span>
                      try {
                        const parsed = JSON.parse(log.details)
                        if (typeof parsed === 'object' && parsed !== null) {
                          return (
                            <div className="flex flex-wrap gap-1.5">
                              {Object.entries(parsed).map(([key, value]) => (
                                <span key={key} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-gray-600">
                                  <span className="font-semibold capitalize">{key}:</span> 
                                  <span>{String(value)}</span>
                                </span>
                              ))}
                            </div>
                          )
                        }
                      } catch (e) {}
                      return <span className="text-gray-500">{log.details}</span>
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && (
            <div className="text-center py-12 text-gray-500">Belum ada riwayat aktivitas yang tercatat.</div>
          )}
        </div>
      </div>
    </div>
  )
}
