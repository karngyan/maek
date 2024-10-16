import { Metadata } from 'next'
import QuickCreateInp from '@/components/quick-create-inp'

export const metadata: Metadata = {
  title: 'home - maek.ai',
}

export default function WorkspaceHomePage() {
  return (
    <>
      <QuickCreateInp />
    </>
  )
}
