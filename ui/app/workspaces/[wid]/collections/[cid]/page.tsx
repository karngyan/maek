'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  useFetchCollection,
  useTrashCollection,
  useUpdateCollection,
} from '@/queries/hooks/collections'
import NotFound from '@/app/not-found'
import { Button } from '@/components/ui/button'
import {
  ArrowLeftIcon,
  EllipsisHorizontalIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '@/components/ui/dropdown'
import { Squares2X2Icon } from '@heroicons/react/24/outline'
import { useDebounceCallback } from '@react-hook/debounce'
import CollectionNotesList from '@/components/collections/notes-list'
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { defaultNewNote } from '@/libs/utils/note'
import { notesKeys } from '@/queries/hooks/notes'
import { v4 as uuidv4 } from 'uuid'
import { PlusIcon } from '@heroicons/react/16/solid'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthInfo } from '@/queries/hooks/auth/use-auth-info'
import {
  SimpleTooltipContent,
  Tooltip,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function NoteIdPage({
  params,
}: {
  params: { wid: string; cid: string }
}) {
  const workspaceId = +params.wid
  const collectionId = +params.cid
  const router = useRouter()

  const { data, isPending, isError } = useFetchCollection(
    workspaceId,
    collectionId
  )
  const collection = useMemo(() => {
    return data?.collection
  }, [data])
  const notes = useMemo(() => {
    return data?.notes ?? []
  }, [data])
  const { data: authInfoResponse } = useAuthInfo()

  const [name, setName] = useState(() => collection?.name ?? '')
  const [description, setDescription] = useState(
    () => collection?.description ?? ''
  )
  const [isTrashConfirmAlertOpen, setIsTrashConfirmAlertOpen] = useState(false)
  const { mutate: deleteCollection } = useTrashCollection({
    onSuccess: () => {
      setIsTrashConfirmAlertOpen(false)
      toast('trashed  collection', {
        description: 'you can restore it from trash, or delete permanently',
      })
      router.replace(`/workspaces/${workspaceId}/collections`)
    },
  })

  const { mutate: updateCollection } = useUpdateCollection()

  useEffect(() => {
    if (!collection) return

    setName(collection.name)
    setDescription(collection.description)
  }, [collection])

  const onDeleteClick = () => {
    setIsTrashConfirmAlertOpen(true)
  }

  const debouncedUpdate = useDebounceCallback(() => {
    updateCollection({
      cid: collectionId,
      wid: workspaceId,
      name: name ?? '',
      description: description ?? '',
      favorite: collection?.favorite ?? false,
    })
  }, 600)

  const qc = useQueryClient()

  const onCreateNewNote = () => {
    const nuuid = uuidv4()

    qc.setQueryData(notesKeys.one(workspaceId, nuuid), {
      note: defaultNewNote(nuuid, workspaceId, '', authInfoResponse!.user),
    })

    const sp = new URLSearchParams()
    sp.set('cid', String(collectionId))
    sp.set('action', 'add')
    router.push(`/workspaces/${workspaceId}/notes/${nuuid}?${sp.toString()}`)
  }

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    debouncedUpdate()
  }

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
    debouncedUpdate()
  }

  const deleteAllConfirm = () => {
    deleteCollection({ wid: workspaceId, cid: collectionId })
  }

  if (isError) {
    return <NotFound embed={true} statusCode={404} />
  }

  if (isPending) {
    return (
      <div className='space-y-4'>
        <div className='h-6 animate-pulse bg-zinc-800 rounded-lg w-2/12'></div>
        <div className='h-6 animate-pulse bg-zinc-800 rounded-lg w-4/12'></div>
      </div>
    )
  }
  return (
    <>
      <div className='relative shrink-0 w-full grow-0 min-h-full'>
        <div className='sticky top-0 border-b border-dashed border-zinc-800 z-50 backdrop-blur-xs bg-zinc-900/60 flex flex-row justify-between p-3'>
          <div className='flex w-full items-center overflow-hidden space-x-1'>
            <Button
              plain
              className='h-8'
              href={`/workspaces/${workspaceId}/collections`}
            >
              <ArrowLeftIcon className='h-6' />
            </Button>
            <div className='flex-1 flex w-full flex-row items-center space-x-2'>
              <div className='flex items-center justify-center rounded-full bg-primary-600 h-8 w-8'>
                <Squares2X2Icon className='h-4 w-4 text-white' />
              </div>
              <div className='flex flex-col w-full'>
                <input
                  type='text'
                  autoFocus={collection?.name === ''}
                  alt='collection name'
                  placeholder='collection name'
                  value={name}
                  onChange={onNameChange}
                  className='w-1/3 px-1.5 py-0.5 text-sm truncate outline-hidden rounded-sm hover:bg-zinc-800 focus:bg-zinc-800 bg-zinc-900 border-none focus:outline-hidden focus:border-transparent border-transparent focus:ring-0 text-zinc-200 font-semibold'
                />
                <input
                  type='text'
                  alt='collection description'
                  placeholder='add a description'
                  value={description}
                  onChange={onDescriptionChange}
                  className='w-2/3 text-xs px-1.5 py-0.5 truncate outline-hidden rounded-sm hover:bg-zinc-800 focus:bg-zinc-800 bg-zinc-900 border-none focus:outline-hidden focus:border-transparent border-transparent focus:ring-0 text-zinc-300'
                />
              </div>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  plain
                  className='h-8'
                  onClick={onCreateNewNote}
                  aria-label='create new note'
                >
                  <PlusIcon className='h-6' />
                </Button>
              </TooltipTrigger>
              <SimpleTooltipContent label='create new note' />
            </Tooltip>
            <Dropdown>
              <DropdownButton plain className='h-8'>
                <EllipsisHorizontalIcon className='h-6' />
              </DropdownButton>
              <DropdownMenu anchor='bottom end'>
                <DropdownItem onClick={onDeleteClick}>
                  <TrashIcon />
                  delete collection
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        <div className='px-6 py-4'>
          <CollectionNotesList
            notes={notes}
            cid={collectionId}
            onCreateNewNote={onCreateNewNote}
          />
        </div>
      </div>

      <Alert
        open={isTrashConfirmAlertOpen}
        onClose={setIsTrashConfirmAlertOpen}
      >
        <AlertTitle>
          are you sure you want to delete{' '}
          <span className='underline underline-offset-2'>
            {collection?.name ?? 'untitled collection'}
          </span>
          ?
        </AlertTitle>
        <AlertDescription>
          it will be moved to trash and will be there for 30 days. you can
          restore it within that period.
        </AlertDescription>
        <AlertActions>
          <Button plain onClick={() => setIsTrashConfirmAlertOpen(false)}>
            cancel
          </Button>
          <Button color='red' onClick={deleteAllConfirm}>
            delete
          </Button>
        </AlertActions>
      </Alert>
    </>
  )
}
