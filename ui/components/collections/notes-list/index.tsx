'use client'

import { Note } from '@/queries/services/note'
import { RectangleStackIcon } from '@heroicons/react/16/solid'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import CollectionNotesListItem from './item'

type CollectionNotesListProps = {
  cid: number
  notes: Note[]
  onCreateNewNote: () => unknown
}

export default function CollectionNotesList({
  cid,
  notes,
  onCreateNewNote,
}: CollectionNotesListProps) {
  const isNotesEmpty = notes.length === 0

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

  return <div className='mt-2'>
    {notes?.map((note) => (
      <div key={note.uuid}>
        <CollectionNotesListItem note={note} cid={cid} />
      </div>
    ))}
  </div>
}
