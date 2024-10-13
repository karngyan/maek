import { login } from '@/queries/services/auth-service'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useLogin = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      qc.setQueryData(['authInfo'], data)
    },
  })
}
