'use client'

import { EditorWrapper } from '@/components/editor/wrapper'
import React, { useMemo, useState } from 'react'
import { validate as uuidValidate } from 'uuid'
import NotFound from '@/app/not-found'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAddNotesToCollection } from '@/queries/hooks/collections'

export default function NoteIdPage({
  params,
}: {
  params: { wid: string; nuuid: string }
}) {
  const workspaceId = +params.wid
  const [validNoteUuid] = useState(() => uuidValidate(params.nuuid))
  const sp = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const { mutate: addNoteToCollection } = useAddNotesToCollection()

  const focusId = sp.get('fid')
  const focusPlacement = sp.get('fplace') as 'end' | 'start' | undefined
  const initialFocusOption = useMemo(() => {
    if (focusId) {
      return { id: focusId, placement: focusPlacement ?? 'end' }
    }
  }, [focusId, focusPlacement])
  const collectionIdStr = sp.get('cid')
  let collectionId: number | undefined
  let exitHrefOverride: string | undefined

  if (collectionIdStr) {
    collectionId = +collectionIdStr
    exitHrefOverride = `/workspaces/${workspaceId}/collections/${collectionId}`
  }

  const onUpsertNote = (noteId: number) => {
    // Add note to collection if action is 'add'
    // then remove the action query param
    const action = sp.get('action')

    if (collectionId != null && action === 'add') {
      addNoteToCollection(
        {
          wid: workspaceId,
          cid: collectionId,
          nids: [noteId],
        },
        {
          onSuccess: () => {
            const nextSearchParams = new URLSearchParams(sp.toString())
            nextSearchParams.delete('action')
            router.replace(`${pathname}?${nextSearchParams.toString()}`)
          },
        }
      )
    }
  }

  if (!validNoteUuid) {
    return <NotFound embed={true} statusCode={404} />
  }

  return (
    <EditorWrapper
      workspaceId={workspaceId}
      noteUuid={params.nuuid}
      initialFocusOption={initialFocusOption}
      exitHref={exitHrefOverride}
      onUpsertNote={onUpsertNote}
    />
  )
}
