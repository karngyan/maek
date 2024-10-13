import { Workspace } from '@/queries/services/auth-service'

export const workspaceAvatarValue = (workspace: Workspace) => {
  return `${workspace.id}:${workspace.name}`
}
