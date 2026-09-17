'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ClipboardList, Calendar, Users, UserCog, DollarSign, Settings, LogOut, History } from 'lucide-react'
import { logoutAction } from '@/actions/auth.actions'

const menuItems = [
  { name: 'Beranda', href: '/dashboard', icon: Home },
  { name: 'Absensi', href: '/dashboard/absensi', icon: ClipboardList },
  { name: 'Jadwal Kegiatan', href: '/dashboard/kegiatan', icon: Calendar },
  { name: 'Struktur Organisasi', href: '/dashboard/struktur', icon: Users },
  { name: 'Keuangan', href: '/dashboard/keuangan', icon: DollarSign, roles: ['admin', 'pengurus'] },
  { name: 'Anggota', href: '/dashboard/anggota', icon: UserCog, roles: ['admin'] },
  { name: 'Audit Log', href: '/dashboard/pengaturan/audit-log', icon: History, roles: ['admin'] },
  { name: 'Pengaturan', href: '/dashboard/pengaturan', icon: Settings },
]

export default function Sidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname()

  const filteredMenus = menuItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  )

  return (
    <div className="hidden md:flex flex-col w-56 bg-[#f7f7f9] border-r border-gray-200 min-h-screen fixed left-0 top-0 bottom-0">
      <div className="h-14 flex items-center px-5 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-black rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs tracking-wider">SM</span>
          </div>
          <span className="font-semibold text-gray-900 text-[15px] tracking-tight">Organisasi</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {filteredMenus.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
                isActive
                  ? 'bg-white text-black font-medium shadow-sm ring-1 ring-gray-200/50'
                  : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gray-500'}`} />
              {item.name}
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </form>
      </div>
    </div>
  )
}
