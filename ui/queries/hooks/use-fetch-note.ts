import { useQuery } from '@tanstack/react-query'
import { fetchNote } from '@/queries/services/note-service'

export const useFetchNote = (workspaceId: number, noteUuid: string) => {
  return useQuery({
    queryFn: () => fetchNote({ workspaceId, noteUuid }),
    queryKey: ['notes', { uuid: noteUuid, wid: workspaceId }],
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: 'always',
  })
}
