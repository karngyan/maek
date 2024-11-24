import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchAllNotes } from '../services/note-service'

export const useFetchAllNotes = (workspaceId: number, sort: string) => {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      fetchAllNotes({ workspaceId, sort, cursor: pageParam }),
    queryKey: ['notes', { wid: workspaceId, sort }],
    initialPageParam: '',
    getNextPageParam: (lastPage) => {
      if (lastPage.nextCursor === '') {
        return undefined
      }

      return lastPage.nextCursor
    },
  })
}
