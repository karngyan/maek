import { Note } from '@/queries/services/note-service'
import NotesListSectionItem from './item'

type NotesListSectionProps = {
  title: string
  timeFormat?: string
  notes?: Note[]
}

const NotesListSection = ({
  title,
  notes,
  timeFormat,
}: NotesListSectionProps) => {
  if (notes == null || notes.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className='text-lg font-medium text-zinc-500'>{title}</h2>
      <div className='mt-2 space-y-2'>
        {notes?.map((note) => (
          <NotesListSectionItem
            key={note.uuid}
            note={note}
            timeFormat={timeFormat}
          />
        ))}
      </div>
    </div>
  )
}

export default NotesListSection
