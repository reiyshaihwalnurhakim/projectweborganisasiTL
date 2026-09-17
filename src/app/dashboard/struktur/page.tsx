import { getOrganizationTree } from '@/actions/structure.actions'
import { getSession } from '@/lib/auth/session'
import { User, Users } from 'lucide-react'

import { prisma } from '@/lib/db'
import StrukturHeader from '@/components/struktur/StrukturHeader'

// Komponen Node Rekursif
function OrgNode({ node }: { node: any }) {
  const isKetua = !node.parentId
  const currentMember = node.organizationMembers?.[0]

  return (
    <div className="flex flex-col items-center">
      <div className={`relative bg-white border ${isKetua ? 'border-red-500 shadow-md ring-1 ring-red-500/20' : 'border-gray-200 shadow-sm'} rounded-xl p-3 w-48 text-center z-10`}>
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 line-clamp-2">{node.name}</div>
        
        {currentMember ? (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center mb-1.5 text-red-600 border border-red-100">
              <User className="w-4 h-4" />
            </div>
            <div className="text-sm font-semibold text-gray-900 truncate w-full">{currentMember.user.nama}</div>
            <div className="text-[10px] text-red-600 mt-1 font-medium bg-red-50/50 px-2 py-0.5 rounded-full border border-red-100/50">
              Periode {currentMember.period}
            </div>
          </div>
        ) : (
          <div className="py-2.5 text-xs text-gray-400 italic">Posisi Kosong</div>
        )}
      </div>

      {node.children && node.children.length > 0 && (
        <>
          {/* Garis vertikal ke bawah dari parent */}
          <div className="w-px h-6 bg-gray-300"></div>
          
          {/* Garis horizontal pembagi */}
          <div className="flex justify-center relative w-full">
            <div className="absolute top-0 h-px bg-gray-300" style={{
              width: `calc(100% - ${100 / node.children.length}%)`
            }}></div>
            
            {/* Render children */}
            <div className="flex gap-4 pt-6 relative">
              {node.children.map((child: any) => (
                <div key={child.id} className="relative flex flex-col items-center">
                  {/* Garis vertikal ke atas ke garis horizontal pembagi */}
                  <div className="absolute -top-6 w-px h-6 bg-gray-300"></div>
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
  const users = await prisma.user.findMany({ where: { status: 'aktif' }, orderBy: { nama: 'asc' } })

  return (
    <div className="space-y-6">
      <StrukturHeader isAdmin={isAdmin} positions={positions} users={users} />

      <div className="bg-[#f7f7f9] p-4 md:p-8 rounded-xl border border-gray-200 overflow-x-auto min-h-[500px]">
        <div className="min-w-max flex flex-col items-center mx-auto">
        {tree.length > 0 ? (
          <div className="flex flex-col items-center">
            {tree.map((rootNode: any) => (
              <OrgNode key={rootNode.id} node={rootNode} />
            ))}

            {/* Node Anggota Universal diletakkan terpisah di bawah struktur tanpa garis agar tidak terlihat meleset */}
            <div className="relative bg-white border border-gray-200 shadow-sm rounded-xl p-4 w-64 text-center z-10 mt-12">
               <div className="flex flex-col items-center">
                 <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mb-2 text-red-600 border border-red-100">
                   <Users className="w-5 h-5" />
                 </div>
                 <div className="text-sm font-bold text-gray-900">Seluruh Anggota</div>
                 <div className="text-xs text-gray-500 mt-1">Anggota Organisasi</div>
               </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 py-12">Belum ada struktur organisasi yang dibuat.</div>
        )}
        </div>
      </div>
    </div>
  )
}
