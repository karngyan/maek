import { Note } from '@/queries/services/note'
import {
  MagnifyingGlassIcon,
  RectangleStackIcon,
} from '@heroicons/react/16/solid'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'

type CollectionNotesListProps = {
  notes: Note[]
}

export default function CollectionNotesList({
  notes,
}: CollectionNotesListProps) {
  const isNotesEmpty = notes.length === 0

  if (isNotesEmpty) {
    return (
      <div className='flex flex-col justify-center items-center py-32 space-y-4'>
        <RectangleStackIcon className='h-8 text-zinc-400' />
        <Text className='max-w-sm text-center'>
          no notes in this collection yet. create a new note in this collection
          or add an existing one.
        </Text>
        <Button>create a new note</Button>
        <Button plain>
          <MagnifyingGlassIcon className='h-4' />
          add an existing note
        </Button>
      </div>
    )
  }

  return <></>
}
