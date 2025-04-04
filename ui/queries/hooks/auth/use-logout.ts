import { logout } from '@/queries/services/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useLogout = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      qc.setQueryData(['authInfo'], null)
    },
  })
}
