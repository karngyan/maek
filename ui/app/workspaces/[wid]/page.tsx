import { Metadata } from 'next'
import QuickCreateInp from '@/components/quick-create/inp'
import NotesList from '@/components/notes-list'

export const metadata: Metadata = {
  title: 'maek',
}

export default function WorkspaceHomePage() {
  return (
    <div className='max-w-4xl mx-auto space-y-10 relative'>
      <QuickCreateInp />
      <NotesList />
      <div className='sticky bottom-0 inset-x-0 h-16 bg-gradient-to-t to-transparent from-zinc-900 pointer-events-none' />
    </div>
  )
}
