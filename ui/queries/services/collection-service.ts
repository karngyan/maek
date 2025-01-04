import { authApiClient } from '@/queries/services/base'

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

interface CollectionResponse {
  collection: Collection
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
