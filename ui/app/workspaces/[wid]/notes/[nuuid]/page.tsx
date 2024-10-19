'use client'

import { EditorWrapper } from '@/components/editor/wrapper'
import React, { useState } from 'react'
import { validate as uuidValidate } from 'uuid'
import NotFound from '@/app/not-found'

export default function NoteIdPage({
  params,
}: {
  params: { wid: string; nuuid: string }
}) {
  const workspaceId = +params.wid
  const [validNoteUuid] = useState(() => uuidValidate(params.nuuid))

  if (!validNoteUuid) {
    return <NotFound embed={true} statusCode={404} />
  }

  return <EditorWrapper workspaceId={workspaceId} noteUuid={params.nuuid} />
}
