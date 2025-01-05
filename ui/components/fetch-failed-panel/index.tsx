import { ExclamationCircleIcon } from '@heroicons/react/16/solid'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'

type FetchFailedPanelProps = {
  onReload: () => unknown
}

export default function FetchFailedPanel({ onReload }: FetchFailedPanelProps) {
  return (
    <div className='border border-zinc-800 border-dashed rounded-xl py-16 flex flex-col items-center justify-center space-y-2'>
      <ExclamationCircleIcon className='text-zinc-700 h-6 w-6' />
      <Text>something went wrong</Text>
      <Button onClick={onReload} outline>
        reload
      </Button>
    </div>
  )
}
