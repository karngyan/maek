'use client'

import { Button } from '@/components/ui/button'
import { PlusIcon } from '@heroicons/react/16/solid'
import { useCreateCollection } from '@/queries/hooks/collections'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useCurrentWorkspaceId } from '@/queries/hooks/auth/use-current-workspace-id'

export default function CollectionsCreateButton() {
  const { mutate: createCollection, isPending } = useCreateCollection()
  const params = useParams<{ wid: string }>()
  const router = useRouter()
  const wid = useCurrentWorkspaceId()

  const onCreateClick = () => {
    createCollection(wid, {
      onSuccess: (data) => {
        const { collection } = data
        router.push(`/workspaces/${params.wid}/collections/${collection.id}`)
      },
      onError: (data) => {
        toast.error('failed to create collection', {
          description: data.message,
        })
      },
    })
  }

  return (
    <>
      <Button
        className='hidden sm:flex'
        disabled={isPending}
        onClick={onCreateClick}
      >
        <PlusIcon />
        new collection
      </Button>
      <Button
        className='flex sm:hidden'
        onClick={onCreateClick}
        disabled={isPending}
      >
        <PlusIcon />
      </Button>
    </>
  )
}
