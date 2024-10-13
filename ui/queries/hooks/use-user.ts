import { useQuery } from '@tanstack/react-query'
import { fetchAuthInfo } from '@/queries/services/auth-service'

export const useUser = () => {
  return useQuery({
    queryKey: ['authInfo'],
    queryFn: fetchAuthInfo,
    staleTime: Infinity,
  })
}
