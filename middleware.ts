import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = await auth()
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  if (isAdminRoute) {
    // Verificar si el usuario está autenticado
    if (!session?.user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Verificar si es admin (por role o por isAdmin)
    const isAdmin = session.user.isAdmin || 
                    session.user.role === 'ADMIN' || 
                    session.user.role === 'SUPER' || 
                    session.user.role === 'MODERATOR'

    if (!isAdmin) {
      console.log('Access denied to admin route for user:', session.user.email, 'Role:', session.user.role, 'isAdmin:', session.user.isAdmin)
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*']
}
