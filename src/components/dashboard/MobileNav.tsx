'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, ClipboardList, Calendar, Users, UserCog, DollarSign, Settings, Menu, X, LogOut, History } from 'lucide-react'
import { logoutAction } from '@/actions/auth.actions'
import logoImg from '@/logo.png'

const menuItems = [
  { name: 'Beranda', href: '/dashboard', icon: Home },
  { name: 'Profil', href: '/dashboard/visi-misi', icon: Users },
  { name: 'Absensi', href: '/dashboard/absensi', icon: ClipboardList },
  { name: 'Jadwal', href: '/dashboard/kegiatan', icon: Calendar },
  { name: 'Struktur', href: '/dashboard/struktur', icon: Users },
  { name: 'Keuangan', href: '/dashboard/keuangan', icon: DollarSign, roles: ['admin', 'pengurus'] },
  { name: 'Anggota', href: '/dashboard/anggota', icon: UserCog },
  { name: 'Audit Log', href: '/dashboard/pengaturan/audit-log', icon: History, roles: ['admin'] },
  { name: 'Pengaturan', href: '/dashboard/pengaturan', icon: Settings },
]

export default function MobileNav({ userRole }: { userRole: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const filteredMenus = menuItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  )

  return (
    <>
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          aria-label="Buka Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity" 
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="relative flex w-full max-w-xs flex-col bg-white h-full shadow-xl">
            <div className="flex h-16 items-center justify-between px-6 border-b">
              <Link 
                href="/dashboard" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5"
              >
                <div className="w-9 h-9 relative flex items-center justify-center shrink-0">
                  <Image
                    src={logoImg}
                    alt="Logo Paskibra"
                    width={36}
                    height={36}
                    className="object-contain w-9 h-9"
                    priority
                  />
                </div>
                <span className="font-bold text-gray-900 text-lg tracking-tight">Paskibra</span>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                aria-label="Tutup Menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {filteredMenus.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-red-50 text-red-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-red-700' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            <div className="p-4 border-t">
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
