import {
  fetchCollection,
  listCollections,
  createCollection,
  updateCollection,
  addNotesToCollection,
  CollectionResponse,
} from '@/queries/services/collection'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notesKeys } from '@/queries/hooks/notes'

const collectionKeys = {
  all: ['collections'] as const,
  oneWithNotes: (wid: number, id: number) => [
    ...collectionKeys.all,
    'notes',
    { id, wid },
  ],
  allByWorkspace: (wid: number) => [...collectionKeys.all, { wid }],
}

export const useFetchCollection = (wid: number, id: number) => {
  return useQuery({
    queryFn: () => fetchCollection(wid, id),
    queryKey: collectionKeys.oneWithNotes(wid, id),
  })
}

export const useFetchAllCollections = (wid: number) => {
  return useQuery({
    queryFn: () => listCollections(wid),
    queryKey: collectionKeys.allByWorkspace(wid),
  })
}

export const useCreateCollection = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createCollection,
    onSuccess: ({ collection }) => {
      qc.setQueryData(
        collectionKeys.oneWithNotes(collection.workspaceId, collection.id),
        { collection, notes: [] }
      )
    },
  })
}

export const useUpdateCollection = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: updateCollection,
    onSuccess: ({ collection }) => {
      const collectionWithNotes = qc.getQueryData<CollectionResponse>(
        collectionKeys.oneWithNotes(collection.workspaceId, collection.id)
      )

      qc.setQueryData(
        collectionKeys.oneWithNotes(collection.workspaceId, collection.id),
        { collection, notes: collectionWithNotes?.notes ?? [] }
      )
    },
  })
}

export const useAddNotesToCollection = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: addNotesToCollection,
    onSuccess: ({ collection, notes }) => {
      qc.setQueryData(
        collectionKeys.oneWithNotes(collection.workspaceId, collection.id),
        { collection, notes }
      )

      notes.forEach((note) => {
        qc.setQueryData(notesKeys.one(note.workspaceId, note.uuid), { note })
      })
    },
  })
}
