'use client'

import React, { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { BlockNoteEditorProps } from '@/components/editor/blocknote'
import { Block } from '@blocknote/core'
import {
  ArrowLeftIcon,
  EllipsisHorizontalIcon,
  LinkIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'
import { Button } from '@/components/ui/button'
import { StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '@/components/ui/dropdown'
import { useToast } from '@/components/ui/hooks/use-toast'
import { useFetchNote, useUpsertNote } from '@/queries/hooks/notes'
import { useDebounceCallback } from '@react-hook/debounce'
import dayjs from 'dayjs'
import { Text } from '@/components/ui/text'
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { useDeleteNote } from '@/queries/hooks/notes'
import relativeTime from 'dayjs/plugin/relativeTime'
import { getHasMeta } from '@/libs/utils/note'
import NotFound from '@/app/not-found'
import { formatTimestamp } from '@/libs/utils/time'
import { useRouter } from 'next/navigation'

type EditorWrapperProps = {
  workspaceId: number
  noteUuid: string
  initialFocusOption?: {
    id: string
    placement: 'end' | 'start'
  }
}

const BlockNoteEditor = dynamic<BlockNoteEditorProps>(
  () => import('./blocknote'),
  { ssr: false }
)

export const EditorWrapper = ({
  workspaceId,
  noteUuid,
  initialFocusOption,
}: EditorWrapperProps) => {
  const { toast } = useToast()
  const router = useRouter()
  const { data, isPending, isError } = useFetchNote(workspaceId, noteUuid)
  const [isDeleteConfirmAlertOpen, setIsDeleteConfirmAlertOpen] =
    useState(false)

  const { mutate: upsertNote } = useUpsertNote()
  const { mutate: deleteNote } = useDeleteNote({
    onSuccess: () => {
      router.replace(`/workspaces/${workspaceId}`)
    },
  })

  const note = useMemo(() => data?.note, [data])
  const ts = useMemo(() => {
    if (!note) return { updated: '', created: '' }
    dayjs.extend(relativeTime)
    return {
      updated: formatTimestamp(note.updated),
      created: formatTimestamp(note.created),
    }
  }, [note])

  const debouncedUpsert = useDebounceCallback((dom: Block[]) => {
    if (!note) return
    const newNote = {
      ...note,
      updated: dayjs().unix(),
      content: {
        ...note.content,
        dom,
      },
    }

    const hasMeta = getHasMeta(newNote) // a little too expensive, may be we should move this to the server or use a more efficient way to update this

    upsertNote({
      ...newNote,
      ...hasMeta,
    })
  }, 600)

  const handleOnChangeDom = (dom: Block[]) => {
    debouncedUpsert(dom)
  }

  const onCopyMaekLinkClick = () => {
    const url = `${window.location.origin}/workspaces/${workspaceId}/notes/${noteUuid}`
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: 'link copied to clipboard',
        description: url,
      })
    })
  }

  const onDeleteClick = () => {
    if (!note) return
    setIsDeleteConfirmAlertOpen(true)
  }

  const onDeleteConfirm = () => {
    if (!note) return
    deleteNote({ workspaceId, noteUuid })
  }

  const onFavoriteClick = () => {
    if (!note) return

    const currentFavorite = note.favorite ?? false
    upsertNote({
      ...note,
      favorite: !currentFavorite,
      updated: dayjs().unix(),
    })
  }

  // if the note is not found, show a 404 page
  // but only if the note is not new
  // if its new and created via quick create, show the editor and wait for the user to edit it so we can save it
  if (isError && !(note?.isNew === true)) {
    return <NotFound embed={true} statusCode={404} />
  }

  return (
    <div className='max-w-4xl mx-auto relative shrink-0 w-full grow-0 h-[calc(100vh-144px)] border border-dashed border-zinc-800 rounded-xl overflow-scroll'>
      <div className='sticky top-0 z-10 backdrop-blur-sm bg-zinc-900/60 flex flex-row justify-between p-6'>
        <Button plain className='h-8' href={`/workspaces/${workspaceId}`}>
          <ArrowLeftIcon className='h-6' />
          <span className='text-zinc-400'>exit</span>
        </Button>
        <div className='inline-flex space-x-0.5 items-center justify-center'>
          <Button plain onClick={onFavoriteClick} className='h-8'>
            {note?.favorite ? (
              <StarIconSolid className='h-6' />
            ) : (
              <StarIcon className='h-6' />
            )}
          </Button>
          <Dropdown>
            <DropdownButton plain className='h-8'>
              <EllipsisHorizontalIcon className='h-6' />
            </DropdownButton>
            <DropdownMenu anchor='bottom end'>
              <DropdownItem onClick={onCopyMaekLinkClick}>
                <LinkIcon />
                copy maek link
              </DropdownItem>
              <DropdownItem onClick={onDeleteClick}>
                <TrashIcon />
                delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      {isPending ? (
        <div className='space-y-4 w-full p-8'>
          <div className='h-6 animate-pulse bg-zinc-800 rounded-lg w-2/12'></div>
          <div className='h-6 animate-pulse bg-zinc-800 rounded-lg w-4/12'></div>
          <div className='h-6 animate-pulse bg-zinc-800 rounded-lg w-8/12'></div>
          <div className='h-6 animate-pulse bg-zinc-800 rounded-lg w-12/12'></div>
        </div>
      ) : (
        <>
          <div className='pl-[3.3rem]'>
            <Text className='text-xs'>{`${ts.created} -- ${ts.updated}`}</Text>
          </div>
          <BlockNoteEditor
            content={note?.content?.dom}
            onChangeDom={(dom) => handleOnChangeDom(dom)}
            initialFocusOption={initialFocusOption}
          />
        </>
      )}
      <Alert
        open={isDeleteConfirmAlertOpen}
        onClose={setIsDeleteConfirmAlertOpen}
      >
        <AlertTitle>are you sure you want to delete this note?</AlertTitle>
        <AlertDescription>
          the note will be moved to trash and will be there for 30 days. you can
          restore it within that period.
        </AlertDescription>
        <AlertActions>
          <Button plain onClick={() => setIsDeleteConfirmAlertOpen(false)}>
            cancel
          </Button>
          <Button color='red' onClick={onDeleteConfirm}>
            delete
          </Button>
        </AlertActions>
      </Alert>
    </div>
  )
}
