import { authApiClient } from '@/queries/services/base'
import { Block } from '@blocknote/core'
import { Collection } from './collection'

interface NoteContent {
  dom: Block[]
}

export interface Note {
  id: number
  uuid: string
  content: NoteContent
  mdContent: string // interesting prop, backend never returns it only flow client -> server
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

interface NoteResponse {
  note: Note
}

interface ListNotesResponse {
  notes: Note[]
  nextCursor: string
}

interface CollectionsForNoteResponse {
  collections: Collection[]
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

export const fetchCollectionsForNote = async ({
  workspaceId,
  noteUuid,
}: {
  workspaceId: number
  noteUuid: string
}): Promise<CollectionsForNoteResponse> => {
  const response = await authApiClient.get<CollectionsForNoteResponse>(
    `/v1/workspaces/${workspaceId}/notes/${noteUuid}/collections`
  )
  return response.data
}

export const addCollectionsToNote = async ({
  wid,
  noteUuid,
  cids = [],
}: {
  wid: number
  noteUuid: string
  cids: number[]
}): Promise<CollectionsForNoteResponse> => {
  const response = await authApiClient.post<CollectionsForNoteResponse>(
    `/v1/workspaces/${wid}/notes/${noteUuid}/collections`,
    {
      collectionIds: cids,
    }
  )

  return response.data
}

export const removeCollectionsFromNote = async ({
  wid,
  noteUuid,
  cids = [],
}: {
  wid: number
  noteUuid: string
  cids: number[]
}): Promise<CollectionsForNoteResponse> => {
  const response = await authApiClient.delete<CollectionsForNoteResponse>(
    `/v1/workspaces/${wid}/notes/${noteUuid}/collections`,
    {
      data: {
        collectionIds: cids,
      },
    }
  )

  return response.data
}

export const fetchCollabInfo = async (wid: number, nuuid: string) => {
  const path = `/v1/workspaces/${wid}/notes/${nuuid}/collab-info`
  const response = await authApiClient.get(path)

  return response.data
}

