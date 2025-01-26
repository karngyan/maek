import { authApiClient } from '@/queries/services/base'
import { Note } from '@/queries/services/note'

export interface Collection {
  id: number
  workspaceId: number
  name: string
  description: string
  created: number
  updated: number
  favorite: boolean
  createdById: number
  updatedById: number
  trashed: boolean
}

export enum CollectionSortKeys {
  UpdatedAsc = 'updated_asc',
  UpdatedDsc = 'updated_dsc',
  NameAsc = 'name_asc',
  NameDsc = 'name_dsc',
}

export interface CollectionResponse {
  collection: Collection
  notes: Note[]
}

interface ListCollectionsResponse {
  collections: Collection[]
  nextCursor: string
}

export const createCollection = async ({
  wid,
  name,
}: {
  wid: number
  name: string
}): Promise<CollectionResponse> => {
  const response = await authApiClient.post<CollectionResponse>(
    `/v1/workspaces/${wid}/collections`,
    {
      name,
    }
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
  favorite,
}: {
  cid: number
  wid: number
  name: string
  description: string
  favorite: boolean
}): Promise<CollectionResponse> => {
  const response = await authApiClient.put<CollectionResponse>(
    `/v1/workspaces/${wid}/collections/${cid}`,
    {
      name,
      description,
      favorite,
    }
  )

  return response.data
}

export const listCollections = async ({
  wid,
  cursor = '',
  limit = 200,
  sort = CollectionSortKeys.UpdatedDsc,
}: {
  wid: number
  cursor?: string
  limit?: number
  sort?: CollectionSortKeys
}): Promise<ListCollectionsResponse> => {
  const response = await authApiClient.get<ListCollectionsResponse>(
    `/v1/workspaces/${wid}/collections`,
    {
      params: {
        cursor,
        limit,
        sort,
      },
    }
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

export const removeNotesFromCollection = async ({
  wid,
  cid,
  nids = [],
}: {
  wid: number
  cid: number
  nids: number[]
}): Promise<void> => {
  await authApiClient.delete<CollectionResponse>(
    `/v1/workspaces/${wid}/collections/${cid}/notes`,
    {
      data: {
        noteIds: nids,
      },
    }
  )
}

export const trashCollection = async ({
  wid,
  cid,
}: {
  wid: number
  cid: number
}): Promise<CollectionResponse> => {
  const response = await authApiClient.delete<CollectionResponse>(
    `/v1/workspaces/${wid}/collections/${cid}`
  )

  return response.data
}

export const trashCollectionMulti = async ({
  wid,
  cids,
}: {
  wid: number
  cids: number[]
}): Promise<void> => {
  // DELETE /collections with query params cids=1&cids=2...
  await authApiClient.delete<CollectionResponse>(
    `/v1/workspaces/${wid}/collections`,
    {
      params: {
        cids,
      },
    }
  )
}
