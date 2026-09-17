import { getOrganizationTree } from '@/actions/structure.actions'
import { getSession } from '@/lib/auth/session'
import { User, Settings } from 'lucide-react'

import { prisma } from '@/lib/db'
import StrukturHeader from '@/components/struktur/StrukturHeader'

// Komponen Node Rekursif
function OrgNode({ node }: { node: any }) {
  const isKetua = !node.parentId
  const currentMember = node.organizationMembers?.[0]

  return (
    <div className="flex flex-col items-center">
      <div className={`relative bg-white border ${isKetua ? 'border-blue-500 shadow-md' : 'border-gray-200'} rounded-xl p-4 w-64 text-center z-10`}>
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{node.name}</div>
        
        {currentMember ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 text-blue-600">
              <User className="w-6 h-6" />
            </div>
            <div className="font-semibold text-gray-900">{currentMember.user.nama}</div>
            <div className="text-xs text-blue-600 mt-1 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
              Periode {currentMember.period}
            </div>
          </div>
        ) : (
          <div className="py-4 text-sm text-gray-400 italic">Posisi Kosong</div>
        )}
      </div>

      {node.children && node.children.length > 0 && (
        <>
          {/* Garis vertikal ke bawah dari parent */}
          <div className="w-px h-8 bg-gray-300"></div>
          
          {/* Garis horizontal pembagi */}
          <div className="flex justify-center relative">
            <div className="absolute top-0 h-px bg-gray-300" style={{
              width: `calc(100% - ${100 / node.children.length}%)`
            }}></div>
            
            {/* Render children */}
            <div className="flex gap-8 pt-8 relative">
              {node.children.map((child: any) => (
                <div key={child.id} className="relative flex flex-col items-center">
                  {/* Garis vertikal ke atas ke garis horizontal pembagi */}
                  <div className="absolute -top-8 w-px h-8 bg-gray-300"></div>
                  <OrgNode node={child} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default async function StrukturPage() {
  const session = await getSession()
  const tree = await getOrganizationTree()
  const isAdmin = session?.role === 'admin'

  const positions = await prisma.position.findMany({ orderBy: { order: 'asc' } })
  const users = await prisma.user.findMany({ where: { status: 'active' }, orderBy: { nama: 'asc' } })

  return (
    <div className="space-y-6">
      <StrukturHeader isAdmin={isAdmin} positions={positions} users={users} />

      <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 overflow-x-auto min-h-[500px] flex justify-center items-start">
        {tree.length > 0 ? (
          tree.map((rootNode: any) => (
            <OrgNode key={rootNode.id} node={rootNode} />
          ))
        ) : (
          <div className="text-gray-500 py-12">Belum ada struktur organisasi yang dibuat.</div>
        )}
      </div>
    </div>
  )
}
