import { User } from '@/queries/services/auth-service'
import { authApiClient } from '@/queries/services/base'

export interface Note {
  id: number
  uuid: string
  content: Record<string, unknown>
  favorite: boolean
  trashed: boolean
  created: number
  updated: number
  createdBy: User
  updatedBy: User
  workspaceId: number
}

export interface NoteResponse {
  note: Note
}

export interface ListNotesResponse {
  notes: Note[]
}

export const upsertNote = async ({
  note,
  workspaceId,
}: {
  note: Note
  workspaceId: number
}): Promise<NoteResponse> => {
  const response = await authApiClient.put<NoteResponse>(
    `/v1/workspaces/${workspaceId}/notes/${note.uuid}`,
    { content: note.content, favorite: note.favorite }
  )
  return response.data
}

export const fetchNote = async ({
  workspaceId,
  noteUuid,
}: {
  workspaceId: number
  noteUuid: string
}): Promise<NoteResponse> => {
  const response = await authApiClient.get<NoteResponse>(
    `/v1/workspaces/${workspaceId}/notes/${noteUuid}`
  )
  return response.data
}

export const fetchAllNotes = async ({
  workspaceId,
}: {
  workspaceId: number
}): Promise<ListNotesResponse> => {
  const response = await authApiClient.get<ListNotesResponse>(
    `/v1/workspaces/${workspaceId}/notes`
  )
  return response.data
}