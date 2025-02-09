import { AuthInfoResponse, updateWorkspace } from '@/queries/services/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useUpdateWorkspace = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: updateWorkspace,
    onSuccess: (_, { name, description, wid }) => {
      const currentAuthInfoResponse = qc.getQueryData<AuthInfoResponse>(['authInfo'])
      if (currentAuthInfoResponse == null) {
        return
      }

      const updatedAuthInfoResponse = {
        ...currentAuthInfoResponse,
        workspaces: currentAuthInfoResponse.workspaces.map((workspace) => {
          if (workspace.id === wid) {
            return {
              ...workspace,
              name,
              description,
            }
          }
          return workspace
        }),
      }

      qc.setQueryData(['authInfo'], updatedAuthInfoResponse)
    },
  })
}
