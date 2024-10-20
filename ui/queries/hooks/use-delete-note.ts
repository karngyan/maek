import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteNote } from '@/queries/services/note-service'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/hooks/use-toast'

export const useDeleteNote = () => {
  const qc = useQueryClient()
  const router = useRouter()
  const { toast } = useToast()

  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      router.replace('/workspaces')
    },
    onError: (error) => {
      toast({
        title: 'failed to delete note',
        description: error.toString(),
      })
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}
