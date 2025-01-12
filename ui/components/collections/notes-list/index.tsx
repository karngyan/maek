'use client'

import { Note } from '@/queries/services/note'
import { RectangleStackIcon } from '@heroicons/react/16/solid'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { v4 as uuidv4 } from 'uuid'
import { notesKeys } from '@/queries/hooks/notes'
import { useCurrentWorkspaceId } from '@/queries/hooks/auth/use-current-workspace-id'
import { useQueryClient } from '@tanstack/react-query'
import { defaultNewNote } from '@/libs/utils/note'
import { useAuthInfo } from '@/queries/hooks/auth/use-auth-info'
import { useRouter } from 'next/navigation'

type CollectionNotesListProps = {
  cid: number
  notes: Note[]
}

export default function CollectionNotesList({
  cid,
  notes,
}: CollectionNotesListProps) {
  const router = useRouter()
  const isNotesEmpty = notes.length === 0
  const wid = useCurrentWorkspaceId()
  const qc = useQueryClient()
  const { data } = useAuthInfo()

  const onCreateNewNote = () => {
    const nuuid = uuidv4()

    qc.setQueryData(notesKeys.one(wid, nuuid), {
      note: defaultNewNote(nuuid, wid, '', data!.user),
    })

    const sp = new URLSearchParams()
    sp.set('cid', String(cid))
    sp.set('action', 'add')
    router.push(`/workspaces/${wid}/notes/${nuuid}?${sp.toString()}`)
  }

  if (isNotesEmpty) {
    return (
      <div className='flex flex-col justify-center items-center py-32 space-y-4'>
        <RectangleStackIcon className='h-8 text-zinc-400' />
        <Text className='max-w-sm text-center'>
          no notes in this collection yet. create a new note in this collection.
        </Text>
        <Button onClick={onCreateNewNote}>create a new note</Button>
      </div>
    )
  }

  return <></>
}
