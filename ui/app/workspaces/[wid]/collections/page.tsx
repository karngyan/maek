import { Button } from '@/components/ui/button'
import { Metadata } from 'next'
import { EllipsisHorizontalIcon, PlusIcon } from '@heroicons/react/16/solid'
import { Text } from '@/components/ui/text'

export const metadata: Metadata = {
  title: 'collections - maek.ai',
}

export default function CollectionsPage() {
  
  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='min-w-0 flex-1'>
          <h2 className='text-lg/6 font-bold text-zinc-300 sm:truncate sm:text-3xl sm:tracking-tight'>
            collections
          </h2>
          <Text>create collections to organize your notes</Text>
        </div>
        <Button className='hidden sm:flex'>
          <PlusIcon />
          new collection
        </Button>
        <Button className='flex sm:hidden'>
          <PlusIcon />
        </Button>
      </div>

      <div className='py-64 flex items-center justify-center flex-col'>
        <EllipsisHorizontalIcon className='h-6 text-zinc-500' />
        <Text>no items here yet</Text>
      </div>
    </div>
  )
}
