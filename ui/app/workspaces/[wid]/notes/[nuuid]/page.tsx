'use client'

import { EditorWrapper } from '@/components/editor/wrapper'
import React, { useMemo, useState } from 'react'
import { validate as uuidValidate } from 'uuid'
import NotFound from '@/app/not-found'
import { useSearchParams } from 'next/navigation'

export default function NoteIdPage({
  params,
}: {
  params: { wid: string; nuuid: string }
}) {
  const workspaceId = +params.wid
  const [validNoteUuid] = useState(() => uuidValidate(params.nuuid))
  const sp = useSearchParams()

  const focusId = sp.get('fid')
  const focusPlacement = sp.get('fplace') as 'end' | 'start' | undefined
  const initialFocusOption = useMemo(() => {
    if (focusId) {
      return { id: focusId, placement: focusPlacement ?? 'end' }
    }
  }, [focusId, focusPlacement])

  if (!validNoteUuid) {
    return <NotFound embed={true} statusCode={404} />
  }

  return (
    <EditorWrapper
      workspaceId={workspaceId}
      noteUuid={params.nuuid}
      initialFocusOption={initialFocusOption}
    />
  )
}
