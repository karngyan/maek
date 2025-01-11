'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  useFetchCollection,
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

export default function NoteIdPage({
  params,
}: {
  params: { wid: string; cid: string }
}) {
  const workspaceId = +params.wid
  const collectionId = +params.cid

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

  const [name, setName] = useState(() => collection?.name)
  const [description, setDescription] = useState(() => collection?.description)

  const { mutate: updateCollection } = useUpdateCollection()

  useEffect(() => {
    setName(collection?.name)
    setDescription(collection?.description)
  }, [collection])

  const onDeleteClick = () => {}

  const debouncedUpdate = useDebounceCallback(() => {
    updateCollection({
      cid: collectionId,
      wid: workspaceId,
      name: name ?? '',
      description: description ?? '',
    })
  }, 600)

  const onNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    debouncedUpdate()
  }

  const onDescriptionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
    debouncedUpdate()
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
      <div className='flex flex-row items-center justify-between'>
        <Button
          plain
          className='h-8'
          href={`/workspaces/${workspaceId}/collections`}
        >
          <ArrowLeftIcon className='h-6' />
          <span className='text-zinc-400'>back</span>
        </Button>
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

      <div className='mt-4'>
        <div className='flex flex-row items-center space-x-2'>
          <div className='flex items-center justify-center rounded-full bg-primary-600 h-12 w-12'>
            <Squares2X2Icon className='h-6 w-6 text-white' />
          </div>
          <div className='flex flex-col w-full space-y-0.5'>
            <input
              type='text'
              autoFocus={collection?.name === ''}
              alt='collection name'
              placeholder='collection name'
              value={name}
              onInput={onNameInput}
              className='w-1/3 px-1.5 py-0.5 text-lg truncate outline-none rounded hover:bg-zinc-800 focus:bg-zinc-800 bg-zinc-900 border-none focus:outline-none focus:border-transparent border-transparent focus:ring-0 text-zinc-300 font-semibold'
            />
            <input
              type='text'
              alt='collection description'
              placeholder='add a description'
              value={description}
              onInput={onDescriptionInput}
              className='w-2/3 text-sm px-1.5 py-0.5 truncate outline-none rounded hover:bg-zinc-800 focus:bg-zinc-800 bg-zinc-900 border-none focus:outline-none focus:border-transparent border-transparent focus:ring-0 text-zinc-400'
            />
          </div>
        </div>
      </div>

      <div className='mt-4'>
        <CollectionNotesList notes={notes} />
      </div>
    </>
  )
}
