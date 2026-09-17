import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth/session'

// Rute yang hanya bisa diakses oleh role tertentu (RBAC)
const protectedRoutes = {
  '/dashboard': ['admin', 'pengurus', 'anggota'],
  '/admin': ['admin'],
  '/pengurus': ['admin', 'pengurus'],
}

// Rute untuk pengguna yang belum login
const publicRoutes = ['/login', '/']

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const sessionCookie = request.cookies.get('session')?.value
  const session = sessionCookie ? await decrypt(sessionCookie) : null

  // 1. Jika sudah login tapi mengakses halaman public (seperti login), arahkan ke dashboard
  if (session && publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 2. Proteksi Rute (RBAC)
  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (path.startsWith(route)) {
      if (!session) {
        // Belum login
        return NextResponse.redirect(new URL('/login', request.url))
      }
      
      if (!allowedRoles.includes(session.role)) {
        // Tidak memiliki hak akses role (Forbidden)
        // Di sini kita bisa arahkan ke halaman 403 atau kembali ke dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
