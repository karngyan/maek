'use client'

import { useFetchAllNotes } from '@/queries/hooks/use-fetch-all-notes'
import { useParams } from 'next/navigation'
import React from 'react'

const NotesList = () => {
  const { wid } = useParams<{ wid: string }>()
  const workspaceId = +wid
  const [sortKey] = React.useState<
    'created' | '-created' | 'updated' | '-updated'
  >('-updated')

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isPending,
    isFetchingNextPage,
    status,
  } = useFetchAllNotes(workspaceId, sortKey)

  if (status === 'pending') {
    return <div>Loading...</div>
  }

  if (status === 'error') {
    return <div>Error: {JSON.stringify(error)}</div>
  }

  return (
    <div>
      <div className='flex flex-row justify-between items-center'>
        <h2 className='text-lg text-zinc-400 font-medium'>all notes</h2>
      </div>
    </div>
  )
}

export default NotesList
