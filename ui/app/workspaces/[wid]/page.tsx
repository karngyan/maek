import { Metadata } from 'next'
import QuickCreateInp from '@/components/quick-create-inp'

export const metadata: Metadata = {
  title: 'home - maek.ai',
}

export default function WorkspaceHomePage() {
  return (
    <div className='max-w-4xl mx-auto'>
      <QuickCreateInp />
    </div>
  )
}
