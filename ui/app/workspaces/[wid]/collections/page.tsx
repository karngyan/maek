import { Metadata } from 'next'
import { Text } from '@/components/ui/text'
import CollectionsCreateButton from '@/components/collections/create-button'
import CollectionsList from '@/components/collections/list'
import { HashtagIcon } from '@heroicons/react/16/solid'

export const metadata: Metadata = {
  title: 'maek',
}

export default function CollectionsPage() {
  return (
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <div className='min-w-0 flex-1 flex items-center space-x-2'>
          <HashtagIcon className='h-5 text-zinc-400' />
          <h2 className='text-xl font-bold text-zinc-400 sm:truncate sm:tracking-tight'>
            collections
          </h2>
        </div>
        <CollectionsCreateButton />
      </div>

      <CollectionsList />
    </div>
  )
}
