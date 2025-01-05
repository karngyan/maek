import {
  fetchCollection,
  listCollections,
  createCollection,
  updateCollection,
  addNotesToCollection,
  CollectionResponse,
  CollectionSortKeys,
  trashCollection,
  trashCollectionMulti,
  removeNotesFromCollection,
} from '@/queries/services/collection'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { notesKeys } from '@/queries/hooks/notes'
import { useToast } from '@/components/ui/hooks/use-toast'

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

export const useFetchAllCollections = (
  wid: number,
  sort: CollectionSortKeys
) => {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      listCollections({ wid, sort, cursor: pageParam }),
    queryKey: [...collectionKeys.allByWorkspace(wid), { sort }],
    initialPageParam: '',
    getNextPageParam: (lastPage) => {
      if (lastPage.nextCursor === '') {
        return undefined
      }

      return lastPage.nextCursor
    },
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

export const useRemoveNotesFromCollection = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: removeNotesFromCollection,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: collectionKeys.all })
    },
  })
}

export const useTrashCollection = ({
  onSuccess,
}: {
  onSuccess?: () => unknown
}) => {
  const qc = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: trashCollection,
    onSuccess: () => {
      if (onSuccess) onSuccess()
    },
    onError: (error) => {
      toast({
        title: 'failed to delete note',
        description: error.toString(),
      })
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: collectionKeys.all })
    },
  })
}

export const useTrashCollectionMulti = ({
  onSuccess,
}: {
  onSuccess?: () => unknown
}) => {
  const qc = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: trashCollectionMulti,
    onSuccess: () => {
      if (onSuccess) onSuccess()
    },
    onError: (error) => {
      toast({
        title: 'failed to delete notes',
        description: error.toString(),
      })
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: collectionKeys.all })
    },
  })
}
