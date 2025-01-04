import { authApiClient, publicApiClient } from '@/queries/services/base'

export interface User {
  id: number
  name: string
  email: string
  verified: boolean
  role: string
  created: number
  updated: number
  defaultWorkspaceId: number
}

export interface Workspace {
  id: number
  name: string
  description: string
  created: number
  updated: number
}

export interface AuthInfoResponse {
  user: User
  workspaces: Workspace[]
}

export const fetchAuthInfo = async (): Promise<AuthInfoResponse> => {
  const response = await authApiClient.get<AuthInfoResponse>('/v1/auth/info')
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
  remember,
}: {
  email: string
  password: string
  remember: boolean
}): Promise<AuthInfoResponse> => {
  const response = await publicApiClient.post<AuthInfoResponse>(
    '/v1/auth/login',
    {
      email,
      password,
      remember,
    }
  )
  return response.data
}

export const logout = async () => {
  await authApiClient.get('/v1/auth/logout')
}
