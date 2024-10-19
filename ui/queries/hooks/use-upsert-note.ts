import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Note, upsertNote } from '@/queries/services/note-service'

const qk = (note: Note) => ['notes', { uuid: note.uuid, wid: note.workspaceId }]

export const useUpsertNote = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: upsertNote,
    onMutate: async (newNote) => {
      const queryKey = qk(newNote)
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
      qc.setQueryData(
        ['notes', { uuid: newNote.uuid, wid: newNote.workspaceId }],
        { note: context?.previousNote }
      )
    },
    onSettled: (resp) => {
      if (resp) void qc.invalidateQueries({ queryKey: qk(resp.note) })
    },
  })
}
