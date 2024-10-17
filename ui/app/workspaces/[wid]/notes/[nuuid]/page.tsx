import { EditorWrapper } from '@/components/editor/wrapper'
import React from 'react'

export default function NoteIdPage({
  params,
}: {
  params: { wid: string; nuuid: string }
}) {
  const workspaceId = +params.wid

  return <EditorWrapper workspaceId={workspaceId} noteUuid={params.nuuid} />
}
