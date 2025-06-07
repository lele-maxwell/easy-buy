import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard', '/products', '/cart', '/orders']
const adminRoutes = ['/admin']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const userRole = request.cookies.get('userRole')?.value
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  // Handle admin routes
  if (isAdminRoute) {
    if (!token || userRole?.toLowerCase() !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Handle protected routes
  if (isProtectedRoute && !token) {
    // Store the original URL to redirect back after login
    const response = NextResponse.redirect(new URL('/auth/login', request.url))
    response.cookies.set('redirectUrl', pathname, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 5 // 5 minutes
    })
    return response
  }

  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (token && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/products/:path*',
    '/cart/:path*',
    '/orders/:path*',
    '/admin/:path*',
    '/auth/:path*'
  ]
} 