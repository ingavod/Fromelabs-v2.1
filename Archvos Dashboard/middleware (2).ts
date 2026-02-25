import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  const publicRoutes = ['/login', '/register']
  if (publicRoutes.includes(pathname)) {
    if (session) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const role = session.user?.role || 'USER'

  if (pathname.startsWith('/admin')) {
    if (role === 'USER') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (pathname.startsWith('/admin/users') || pathname.startsWith('/admin/suscripciones')) {
      if (role === 'MODERATOR') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logo-from-e.png).*)',
  ]
}
