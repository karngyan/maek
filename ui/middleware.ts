import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import axios from 'axios'
import { AuthInfoResponse } from '@/queries/services/auth-service'

// runs on server
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const sessionToken = req.cookies.get('session_token')

  if (!sessionToken || sessionToken.value === 'undefined') {
    if (pathname === '/login' || pathname === '/register') {
      return NextResponse.next()
    }

    return NextResponse.redirect(new URL('/login', req.url))
  }

  const authInfo = await fetchAuthInfoServer(sessionToken.value)
  if (!authInfo) {
    const response = NextResponse.redirect(new URL('/login', req.url))
    response.cookies.set('session_token', '', {
      maxAge: -1,
      path: '/',
    })

    return response
  }

  const workspaceId = authInfo?.user.defaultWorkspaceId

  // Redirect if the user is logged in and tries to visit /login or /register
  if (pathname === '/login' || pathname === '/register') {
    return NextResponse.redirect(new URL(`/workspaces/${workspaceId}`, req.url))
  }

  if (pathname === '/workspaces') {
    return NextResponse.redirect(new URL(`/workspaces/${workspaceId}`, req.url))
  }

  if (pathname === '/workspaces/') {
    return NextResponse.redirect(new URL(`/workspaces/${workspaceId}`, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/register', '/workspaces/:path*'],
}

const fetchAuthInfoServer = async (
  token: string
): Promise<AuthInfoResponse | null> => {
  const apiUrl = process.env.API_URL

  try {
    const response = await axios.get(`${apiUrl}/v1/auth/info`, {
      headers: {
        Cookie: `session_token=${token}`,
      },
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return null
      }
    }

    throw error
  }
}
