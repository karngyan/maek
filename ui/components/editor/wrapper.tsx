'use client'

import React, { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { BlockNoteEditorProps } from '@/components/editor/blocknote'
import { PartialBlock } from '@blocknote/core'
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
import { useFetchNote } from '@/queries/hooks/use-fetch-note'
import { useUpsertNote } from '@/queries/hooks/use-upsert-note'
import { useDebounceCallback } from '@react-hook/debounce'
import dayjs from 'dayjs'
import { Text } from '@/components/ui/text'
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { useDeleteNote } from '@/queries/hooks/use-delete-note'
import relativeTime from 'dayjs/plugin/relativeTime'

type EditorWrapperProps = {
  workspaceId: number
  noteUuid: string
}

const BlockNoteEditor = dynamic<BlockNoteEditorProps>(
  () => import('./blocknote'),
  { ssr: false }
)

export const EditorWrapper = ({
  workspaceId,
  noteUuid,
}: EditorWrapperProps) => {
  const { toast } = useToast()
  const { data } = useFetchNote(workspaceId, noteUuid)
  const [isDeleteConfirmAlertOpen, setIsDeleteConfirmAlertOpen] =
    useState(false)
  const { mutate: upsertNote } = useUpsertNote()
  const { mutate: deleteNote } = useDeleteNote()

  const note = useMemo(() => data?.note, [data])
  const updated = useMemo(() => {
    if (!note) return ''
    dayjs.extend(relativeTime)
    return dayjs.unix(note.updated).fromNow()
  }, [note])

  const debouncedUpsert = useDebounceCallback((dom: PartialBlock[]) => {
    if (!note) return

    upsertNote({
      ...note,
      updated: dayjs().unix(),
      content: {
        ...note.content,
        dom,
      },
    })
  }, 600)

  const handleOnChangeDom = (dom: PartialBlock[]) => {
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
      <div className='pl-[3.3rem]'>
        <Text className='text-xs'>{`last updated: ${updated.toLowerCase()}`}</Text>
      </div>
      <BlockNoteEditor
        content={note?.content?.dom}
        onChangeDom={(dom) => handleOnChangeDom(dom)}
      />
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
