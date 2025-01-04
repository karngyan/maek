import { useQuery } from '@tanstack/react-query'
import { fetchAuthInfo } from '@/queries/services/auth'
import axios from 'axios'

export const useAuthInfo = () => {
  return useQuery({
    queryKey: ['authInfo'],
    queryFn: fetchAuthInfo,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return false
      }

      return failureCount < 3
    },
  })
}
