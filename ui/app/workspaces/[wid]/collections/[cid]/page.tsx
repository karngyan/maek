'use client'

import React from 'react'

export default function NoteIdPage({
  params,
}: {
  params: { wid: string; cid: string }
}) {
  const workspaceId = +params.wid
  const collectionId = +params.cid

  return (
    <>
      <p>
        {workspaceId} {collectionId}
      </p>
    </>
  )
}
