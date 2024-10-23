import { forEachBlock } from '@/libs/utils/note'
import { Note } from '@/queries/services/note-service'
import Link from 'next/link'
import { useMemo } from 'react'
import days from 'dayjs'

type NotesListSectionItemProps = {
  note: Note
  timeFormat?: string
}

const NotesListSectionItem = ({
  note,
  timeFormat = 'MMM D, YYYY h:mm A',
}: NotesListSectionItemProps) => {
  const title = useMemo(() => {
    let s = ''
    let hasTable = false

    forEachBlock(note.content.dom, (block) => {
      if (block.content == null) {
        return true // continue search
      }

      if (Array.isArray(block.content) === false) {
        // TableContent
        hasTable = true
        return true // continue search for any direct text, not gonna look into table cells
      }

      for (const inlineContent of block.content) {
        if ('text' in inlineContent) {
          s = inlineContent.text
          return false
        }
      }

      return true
    })

    if (s == '' && hasTable) {
      s = 'contains a table only'
    }

    return s
  }, [note])

  return (
    <Link
      key={note.uuid}
      href={`/workspaces/${note.workspaceId}/notes/${note.uuid}`}
      className='flex items-center rounded-lg justify-between p-2 hover:bg-zinc-800 transition-colors duration-200'
    >
      <div>
        <p className='text-sm truncate text-zinc-400'>{title}</p>
      </div>
      <p className='text-xs text-zinc-500'>
        {days.unix(note.updated).format(timeFormat)}
      </p>
    </Link>
  )
}

export default NotesListSectionItem
