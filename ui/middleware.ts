import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const Cookies = {
  lastVisitedWorkspaceId: 'last_visited_ws_id',
  sesstionToken: 'session_token',
}

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
  const sessionToken = req.cookies.get(Cookies.sesstionToken)

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

  let workspaceId = +sessionToken.value.split(':')[0] // default workspace id
  const lastVisitedWorkspaceId = req.cookies.get(Cookies.lastVisitedWorkspaceId)

  if (lastVisitedWorkspaceId != null && lastVisitedWorkspaceId.value !== 'undefined' && !isNaN(+lastVisitedWorkspaceId.value)) {
    workspaceId = +lastVisitedWorkspaceId.value
  }

  // redirect to workspace if the user is logged in and tries to visit /login or /register
  if (isProtectedWhenLoggedIn(pathname)) {
    return NextResponse.redirect(new URL(`/workspaces/${workspaceId}/notes`, req.url))
  }

  // /workspaces/(number) and /workspaces/(number)/ -> /workspaces/(number)/notes
  if (/^\/workspaces\/\d+\/?$/.test(pathname)) {
    return NextResponse.redirect(new URL(`${pathname}/notes`, req.url))
  }

  if (pathname === '/workspaces' || pathname === '/workspaces/') {
    return NextResponse.redirect(new URL(`/workspaces/${workspaceId}/notes`, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/register', '/workspaces/:path*'],
}
