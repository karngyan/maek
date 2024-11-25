'use client'

import { useParams } from 'next/navigation'

export const useCurrentWorkspaceId = () => {
  const { wid } = useParams()
  const workspaceId = +wid
  return workspaceId
}
