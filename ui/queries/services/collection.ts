import { authApiClient } from '@/queries/services/base'
import { Note } from '@/queries/services/note'

interface Collection {
  id: number
  workspaceId: number
  name: string
  description: string
  created: number
  updated: number
  createdById: number
  updatedById: number
  trashed: boolean
}

export interface CollectionResponse {
  collection: Collection
  notes: Note[]
}

interface ListCollectionsResponse {
  collections: Collection[]
  nextCursor: string
}

export const createCollection = async (
  wid: number
): Promise<CollectionResponse> => {
  const response = await authApiClient.post<CollectionResponse>(
    `/v1/workspaces/${wid}/collections`
  )

  return response.data
}

export const fetchCollection = async (
  wid: number,
  cid: number
): Promise<CollectionResponse> => {
  const response = await authApiClient.get<CollectionResponse>(
    `/v1/workspaces/${wid}/collections/${cid}`
  )

  return response.data
}

export const updateCollection = async ({
  cid,
  wid,
  name,
  description,
}: {
  cid: number
  wid: number
  name: string
  description: string
}): Promise<CollectionResponse> => {
  const response = await authApiClient.put<CollectionResponse>(
    `/v1/workspaces/${wid}/collections/${cid}`,
    {
      name,
      description,
    }
  )

  return response.data
}

export const listCollections = async (
  wid: number
): Promise<ListCollectionsResponse> => {
  const response = await authApiClient.get<ListCollectionsResponse>(
    `/v1/workspaces/${wid}/collections`
  )

  return response.data
}

export const addNotesToCollection = async ({
  wid,
  cid,
  nids = [],
}: {
  wid: number
  cid: number
  nids: number[]
}): Promise<CollectionResponse> => {
  const response = await authApiClient.post<CollectionResponse>(
    `/v1/workspaces/${wid}/collections/${cid}/notes`,
    {
      noteIds: nids,
    }
  )

  return response.data
}
