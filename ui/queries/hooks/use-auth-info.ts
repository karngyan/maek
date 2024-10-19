import { useQuery } from '@tanstack/react-query'
import { fetchAuthInfo } from '@/queries/services/auth-service'

export const useAuthInfo = () => {
  return useQuery({
    queryKey: ['authInfo'],
    queryFn: fetchAuthInfo,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
