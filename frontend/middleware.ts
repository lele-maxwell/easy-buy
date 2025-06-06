import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const userRole = request.cookies.get('userRole')?.value

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token || userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Protect user routes that require authentication
  if (request.nextUrl.pathname.startsWith('/products') && !token) {
    return NextResponse.redirect(new URL('/auth/register', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/products/:path*']
} 