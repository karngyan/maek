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
} from '@/queries/services/note-service'
import { useToast } from '@/components/ui/hooks/use-toast'
import { keys } from './keys'

export const useFetchNote = (workspaceId: number, noteUuid: string) => {
  return useQuery({
    queryFn: () => fetchNote({ workspaceId, noteUuid }),
    queryKey: keys.note(workspaceId, noteUuid),
    staleTime: 10 * 1000,
    refetchOnWindowFocus: 'always',
  })
}

export const useFetchAllNotes = (workspaceId: number, sort: string) => {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      fetchAllNotes({ workspaceId, sort, cursor: pageParam }),
    queryKey: [...keys.notesByWorkspace(workspaceId), { sort }],
    initialPageParam: '',
    getNextPageParam: (lastPage) => {
      if (lastPage.nextCursor === '') {
        return undefined
      }

      return lastPage.nextCursor
    },
  })
}

export const useUpsertNote = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: upsertNote,
    onMutate: async (newNote) => {
      const queryKey = keys.note(newNote.workspaceId, newNote.uuid)

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
      const queryKey = keys.note(newNote.workspaceId, newNote.uuid)
      qc.setQueryData(queryKey, { note: context?.previousNote })
    },
    onSettled: (resp) => {
      if (!resp) return
      const queryKey = keys.note(resp.note.workspaceId, resp.note.uuid)
      void qc.invalidateQueries({ queryKey })
    },
  })
}

export const useDeleteNote = ({ onSuccess }: { onSuccess?: () => unknown }) => {
  const qc = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: deleteNote,
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
      void qc.invalidateQueries({ queryKey: keys.allNotes() })
    },
  })
}

export const useDeleteNoteMulti = ({
  onSuccess,
}: {
  onSuccess?: () => unknown
}) => {
  const qc = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: deleteNoteMulti,
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
      void qc.invalidateQueries({ queryKey: keys.allNotes() })
    },
  })
}
