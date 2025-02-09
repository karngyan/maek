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

export const updateUser = async ({
  name,
  email = '',
  updateType = 'name',
}: {
  name?: string
  email?: string,
  updateType?: 'name' | 'email' | 'both'
}): Promise<void> => {
  await authApiClient.put<void>('/v1/auth/user', {
    name,
    email,
    updateType,
  })
}

export const updateWorkspace = async ({
  wid,
  name,
  description,
}: {
  wid: number,
  name: string
  description: string,
}): Promise<void> => {
  await authApiClient.put<void>(`/v1/auth/workspaces/${wid}`, {
    name,
    description,
  })
}

interface AddWorkspaceResponse {
  workspace: Workspace
}

export const addWorkspaceForUser = async ({
  name, 
  description,
}: {
  name: string
  description: string,
}): Promise<AddWorkspaceResponse> => {
  const response = await authApiClient.post<AddWorkspaceResponse>('/v1/auth/workspaces', {
    name,
    description,
  })

  return response.data
}
