import MobileNav from './MobileNav'
import { User as UserIcon } from 'lucide-react'

interface TopNavProps {
  user: {
    username: string;
    nama: string;
    role: string;
    foto?: string | null;
  }
}

export default function TopNav({ user }: TopNavProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Mobile menu trigger */}
        <MobileNav userRole={user.role} />

        {/* Empty space for desktop to push profile to right */}
        <div className="hidden md:block flex-1" />

        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900">{user.nama}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 capitalize font-medium">
              {user.role}
            </span>
          </div>
          
          <div className="h-9 w-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
            {user.foto ? (
              <img src={user.foto} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <UserIcon className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
