import { AuthInfoResponse, updateUser } from '@/queries/services/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useUpdateUser = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (_, { name, email, updateType }) => {
      const currentAuthInfoResponse = qc.getQueryData<AuthInfoResponse>(['authInfo'])
      if (currentAuthInfoResponse == null) {
        return
      }

      const updatedAuthInfoResponse = {
        ...currentAuthInfoResponse,
        user: {
          ...currentAuthInfoResponse.user,
          name: updateType === 'name' || updateType === 'both' ? name : currentAuthInfoResponse.user.name,
          email: updateType === 'email' || updateType === 'both' ? email : currentAuthInfoResponse.user.email,
        },
      }

      qc.setQueryData(['authInfo'], updatedAuthInfoResponse)
    },
  })
}
