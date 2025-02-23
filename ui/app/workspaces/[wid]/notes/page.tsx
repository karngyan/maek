import { Metadata } from 'next'
import QuickCreateInp from '@/components/quick-create/inp'
import NotesList from '@/components/notes-list'

export const metadata: Metadata = {
  title: 'maek',
}

export default function NotesPage() {
  return (
    <>
      <div className='space-y-10 p-6'>
        <QuickCreateInp />
        <NotesList />
      </div>
      <div className='sticky bottom-0 inset-x-0 h-16 bg-linear-to-t to-transparent from-zinc-900 pointer-events-none' />
    </>
  )
}
