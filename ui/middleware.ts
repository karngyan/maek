// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// runs on server
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const sessionToken = req.cookies.get('session_token')

  if (sessionToken && sessionToken.value !== 'undefined') {
    const accountId = sessionToken.value.split(':')[0]
    // Redirect if the user is logged in and tries to visit /login or /register
    if (pathname === '/login' || pathname === '/register') {
      return NextResponse.redirect(new URL(`/accounts/${accountId}`, req.url))
    }

    if (pathname === '/accounts') {
      return NextResponse.redirect(new URL(`/accounts/${accountId}`, req.url))
    }
  } else {
    if (pathname.startsWith('/accounts')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/register', '/accounts/:path*'],
}
