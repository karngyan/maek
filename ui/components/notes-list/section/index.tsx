import { Note } from '@/queries/services/note-service'
import NotesListSectionItem from './item'

type NotesListSectionProps = {
  title: string
  notes?: Note[]
}

const NotesListSection = ({ title, notes }: NotesListSectionProps) => {
  if (notes == null || notes.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className='text-lg font-semibold text-zinc-400'>{title}</h2>
      <div className='mt-2'>
        {notes?.map((note) => (
          <div key={note.uuid}>
            <NotesListSectionItem note={note} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotesListSection
