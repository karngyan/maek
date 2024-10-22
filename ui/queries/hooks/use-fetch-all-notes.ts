import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchAllNotes } from '../services/note-service'

export const useFetchAllNotes = (
  workspaceId: number,
  sort: 'created' | '-created' | 'updated' | '-updated'
) => {
  return useInfiniteQuery({
    queryFn: () => fetchAllNotes({ workspaceId, sort }),
    queryKey: ['notes', { wid: workspaceId, sort }],
    initialPageParam: { cursor: '' },
    getNextPageParam: ({ nextCursor }) => {
      return {
        cursor: nextCursor,
      }
    },
  })
}
