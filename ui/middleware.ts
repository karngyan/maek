import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isPathPublic = (pathname: string) => {
  return (
    isProtectedWhenLoggedIn(pathname) ||
    pathname === '/' ||
    pathname === '/privacy' ||
    pathname === '/terms'
  )
}

const isProtectedWhenLoggedIn = (pathname: string) => {
  return pathname === '/login' || pathname === '/register'
}

// runs on server
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const sessionToken = req.cookies.get('session_token')

  // redirect to log-in page if the user is not logged in
  // presence of session token can be considered as logged in
  // the next time `useAuthInfo` runs, it will fetch the user info
  // if the session token is expired, the api would return 401 and clear the httponly secure cookie
  if (!sessionToken || sessionToken.value === 'undefined') {
    if (isPathPublic(pathname)) {
      return NextResponse.next()
    }

    return NextResponse.redirect(new URL('/login', req.url))
  }

  const workspaceId = +sessionToken.value.split(':')[0]

  // redirect to workspace if the user is logged in and tries to visit /login or /register
  if (isProtectedWhenLoggedIn(pathname)) {
    return NextResponse.redirect(new URL(`/workspaces/${workspaceId}/notes`, req.url))
  }

  if (pathname === '/workspaces' || pathname === '/workspaces/' || pathname === `/workspaces/${workspaceId}`) {
    return NextResponse.redirect(new URL(`/workspaces/${workspaceId}/notes`, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/register', '/workspaces/:path*'],
}
