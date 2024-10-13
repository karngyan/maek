import { authApiClient, publicApiClient } from '@/queries/services/base'

interface User {
  id: number
  name: string
  email: string
  verified: boolean
  role: string
  created: number
  updated: number
  defaultAccountId: number
}

interface Account {
  id: number
  name: string
  description: string
  created: number
  updated: number
}

interface AuthInfoResponse {
  user: User
  accounts: Account[]
}

export const fetchAuthInfo = async (): Promise<AuthInfoResponse> => {
  const response = await authApiClient.get<AuthInfoResponse>('/v1/auth/me')
  return response.data
}

export const register = async ({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}): Promise<AuthInfoResponse> => {
  const response = await publicApiClient.post<AuthInfoResponse>(
    '/v1/auth/register',
    {
      name,
      email,
      password,
    }
  )
  return response.data
}

export const login = async ({
  email,
  password,
  rememberMe,
}: {
  email: string
  password: string
  rememberMe: boolean
}): Promise<AuthInfoResponse> => {
  const response = await publicApiClient.post<AuthInfoResponse>(
    '/v1/auth/login',
    {
      email,
      password,
      rememberMe,
    }
  )
  return response.data
}

export const logout = async () => {
  await authApiClient.get('/v1/auth/logout')
}
