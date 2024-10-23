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
      <h2 className='text-lg font-semibold text-zinc-400'>{title}</h2>
      <div className='mt-2'>
        {notes?.map((note) => (
          <div key={note.uuid}>
            <NotesListSectionItem note={note} timeFormat={timeFormat} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotesListSection
