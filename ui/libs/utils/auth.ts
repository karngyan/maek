import { Workspace } from '@/queries/services/auth'

export const workspaceAvatarValue = (workspace: Workspace) => {
  return `${workspace.id}:${workspace.name}`
}
