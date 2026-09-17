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
    <div className="hidden md:flex flex-col w-64 bg-white border-r min-h-screen fixed left-0 top-0 bottom-0">
      <div className="h-16 flex items-center px-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SM</span>
          </div>
          <span className="font-bold text-gray-900 text-lg">Organisasi</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {filteredMenus.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
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
