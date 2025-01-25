import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  fetchNote,
  fetchAllNotes,
  upsertNote,
  Note,
  deleteNote,
  deleteNoteMulti,
  fetchCollectionsForNote,
  addCollectionsToNote,
  removeCollectionsFromNote,
} from '@/queries/services/note'
import { toast } from 'sonner'

export const notesKeys = {
  all: ['notes'] as const,
  one: (workspaceId: number, noteUuid: string) => [
    ...notesKeys.all,
    { wid: workspaceId, uuid: noteUuid },
  ],
  allByWorkspace: (workspaceId: number) => [
    ...notesKeys.all,
    { wid: workspaceId },
  ],
  collectionsForNote: (workspaceId: number, noteUuid: string) => [
    ...notesKeys.one(workspaceId, noteUuid),
    'collections',
  ],
}

export const useFetchNote = (workspaceId: number, noteUuid: string) => {
  return useQuery({
    queryFn: () => fetchNote({ workspaceId, noteUuid }),
    queryKey: notesKeys.one(workspaceId, noteUuid),
    staleTime: 10 * 1000,
    refetchOnWindowFocus: 'always',
  })
}

export const useFetchAllNotes = (workspaceId: number, sort: string) => {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      fetchAllNotes({ workspaceId, sort, cursor: pageParam }),
    queryKey: [...notesKeys.allByWorkspace(workspaceId), { sort }],
    initialPageParam: '',
    getNextPageParam: (lastPage) => {
      if (lastPage.nextCursor === '') {
        return undefined
      }

      return lastPage.nextCursor
    },
  })
}

export const useFetchCollectionsForNote = (
  workspaceId: number,
  noteUuid: string
) => {
  return useQuery({
    queryFn: () => fetchCollectionsForNote({ workspaceId, noteUuid }),
    queryKey: notesKeys.collectionsForNote(workspaceId, noteUuid),
    refetchOnWindowFocus: false,
  })
}

export const useAddCollectionsToNote = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: addCollectionsToNote,
    onSuccess: ({ collections }, { wid, noteUuid }) => {
      qc.setQueryData(
        notesKeys.collectionsForNote(wid, noteUuid),
        { collections }
      )
    },
  })
}

export const useRemoveCollectionsFromNote = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: removeCollectionsFromNote,
    onSuccess: ({ collections }, { wid, noteUuid }) => {
      qc.setQueryData(
        notesKeys.collectionsForNote(wid, noteUuid),
        { collections }
      )
    },
  })
}

export const useUpsertNote = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: upsertNote,
    onMutate: async (newNote) => {
      const queryKey = notesKeys.one(newNote.workspaceId, newNote.uuid)

      // Cancel any outgoing re-fetches (so they don't overwrite our optimistic update)
      await qc.cancelQueries({
        queryKey,
      })

      // Snapshot the previous value
      const previousNote = qc.getQueryData<Note>(queryKey)

      // Optimistically update to the new value
      qc.setQueryData(queryKey, { note: newNote })

      return { previousNote, newNote }
    },
    onError: (err, newNote, context) => {
      // Roll back to the previous value
      const queryKey = notesKeys.one(newNote.workspaceId, newNote.uuid)
      qc.setQueryData(queryKey, { note: context?.previousNote })
    },
    onSettled: (resp) => {
      if (!resp) return
      const queryKey = notesKeys.one(resp.note.workspaceId, resp.note.uuid)
      void qc.invalidateQueries({ queryKey })
    },
  })
}

export const useDeleteNote = ({ onSuccess }: { onSuccess?: () => unknown }) => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      if (onSuccess) onSuccess()
    },
    onError: (error) => {
      toast('failed to delete note', {
        description: error.toString(),
      })
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: notesKeys.all })
    },
  })
}

export const useDeleteNoteMulti = ({
  onSuccess,
}: {
  onSuccess?: () => unknown
}) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteNoteMulti,
    onSuccess: () => {
      if (onSuccess) onSuccess()
    },
    onError: (error) => {
      toast.error('failed to delete notes', {
        description: error.toString(),
      })
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: notesKeys.all })
    },
  })
}
