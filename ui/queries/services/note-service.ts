import { User } from '@/queries/services/auth-service'
import { authApiClient } from '@/queries/services/base'
import { Block } from '@blocknote/core'

interface NoteContent {
  dom: Block[]
}

export interface Note {
  id: number
  uuid: string
  content: NoteContent
  favorite: boolean
  trashed: boolean
  created: number
  updated: number
  createdById: number
  updatedById: number
  workspaceId: number
  hasAudios: boolean
  hasClosedTasks: boolean
  hasCode: boolean
  hasContent: boolean
  hasFiles: boolean
  hasImages: boolean
  hasLinks: boolean
  hasOpenTasks: boolean
  hasQuotes: boolean
  hasTables: boolean
  hasVideos: boolean

  isNew?: boolean // client side only
}

export interface NoteResponse {
  note: Note
}

export interface ListNotesResponse {
  notes: Note[]
  authors: User[]
  nextCursor: string
}

export const upsertNote = async (note: Note): Promise<NoteResponse> => {
  const response = await authApiClient.put<NoteResponse>(
    `/v1/workspaces/${note.workspaceId}/notes/${note.uuid}`,
    { ...note }
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

export const deleteNote = async ({
  workspaceId,
  noteUuid,
}: {
  workspaceId: number
  noteUuid: string
}): Promise<void> => {
  await authApiClient.delete(`/v1/workspaces/${workspaceId}/notes/${noteUuid}`)
}

export const deleteNoteMulti = async ({
  workspaceId,
  noteUuids,
}: {
  workspaceId: number
  noteUuids: string[]
}): Promise<void> => {
  // DELETE /notes with query params noteUuids=uuid1&noteUuids=uuid2...
  await authApiClient.delete(`/v1/workspaces/${workspaceId}/notes`, {
    params: {
      note_uuids: noteUuids,
    },
  })
}

export const fetchAllNotes = async ({
  workspaceId,
  cursor = '',
  sort = 'updated_dsc',
  limit = 100,
}: {
  workspaceId: number
  cursor?: string
  limit?: number
  sort?: string
}): Promise<ListNotesResponse> => {
  const response = await authApiClient.get<ListNotesResponse>(
    `/v1/workspaces/${workspaceId}/notes`,
    {
      params: {
        cursor,
        sort,
        limit,
      },
    }
  )
  return response.data
}
