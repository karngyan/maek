import { register } from '@/queries/services/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useRegister = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      qc.setQueryData(['authInfo'], data)
    },
  })
}
