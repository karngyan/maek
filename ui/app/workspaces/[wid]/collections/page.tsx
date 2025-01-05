import { Metadata } from 'next'
import { Text } from '@/components/ui/text'
import CollectionsCreateButton from '@/components/collections/create-button'
import CollectionsList from '@/components/collections/list'

export const metadata: Metadata = {
  title: 'collections - maek.ai',
}

export default function CollectionsPage() {
  return (
    <div className='max-w-4xl mx-auto'>
      <div className='flex items-center justify-between'>
        <div className='min-w-0 flex-1'>
          <h2 className='text-lg/6 font-bold text-zinc-300 sm:truncate sm:text-3xl sm:tracking-tight'>
            collections
          </h2>
          <Text>create collections to organize your notes</Text>
        </div>
        <CollectionsCreateButton />
      </div>

      <CollectionsList />
    </div>
  )
}
