import { addWorkspaceForUser, AuthInfoResponse } from '@/queries/services/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useAddWorkspace = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: addWorkspaceForUser,
    onSuccess: ({ workspace }) => {
      const currentAuthInfoResponse = qc.getQueryData<AuthInfoResponse>(['authInfo'])
      if (currentAuthInfoResponse == null) {
        return
      }

      const updatedAuthInfoResponse = {
        ...currentAuthInfoResponse,
        workspaces: [...currentAuthInfoResponse.workspaces, workspace],
      }
      
      qc.setQueryData(['authInfo'], updatedAuthInfoResponse)
    },
  })
}
