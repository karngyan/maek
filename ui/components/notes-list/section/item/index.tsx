'use client'

import { getNoteTitle } from '@/libs/utils/note'
import { Note } from '@/queries/services/note'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import ScribbleIcon from '@/components/ui/icons/scribble'
import { useNoteMeta } from '@/libs/providers/note-meta'
import { Checkbox } from '@/components/ui/checkbox'
import clsx from 'clsx'
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
} from '@/components/ui/dropdown'
import {
  EllipsisHorizontalIcon,
  LinkIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'
import { formatFullDate, formatTimestamp } from '@/libs/utils/time'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/hooks/use-toast'
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertActions,
} from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useDeleteNote } from '@/queries/hooks/notes'

type NotesListSectionItemProps = {
  note: Note
}

const NotesListSectionItem = ({ note }: NotesListSectionItemProps) => {
  const { toast } = useToast()
  const { noteMeta, setNoteMeta } = useNoteMeta()
  const [isDeleteConfirmAlertOpen, setIsDeleteConfirmAlertOpen] =
    useState(false)
  const { mutate: deleteNote } = useDeleteNote({
    onSuccess: () => {
      setIsDeleteConfirmAlertOpen(false)
    },
  })

  const title = useMemo(() => {
    return getNoteTitle(note)
  }, [note])

  const onDeleteConfirm = () => {
    if (!note) return
    deleteNote({ workspaceId: note.workspaceId, noteUuid: note.uuid })
  }

  const onCheckboxClick = (checked: boolean, uuid: string) => {
    const currentState = noteMeta[note.uuid]?.isSelected === true
    if (currentState === checked) {
      return
    }

    setNoteMeta({
      ...noteMeta,
      [uuid]: {
        ...noteMeta[uuid],
        isSelected: checked,
      },
    })
  }

  const onCopyMaekLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = `${window.location.origin}/workspaces/${note.workspaceId}/notes/${note.uuid}`
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: 'link copied to clipboard',
        description: url,
      })
    })
  }

  const onDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (note == null) return
    setIsDeleteConfirmAlertOpen(true)
  }

  const isNoteSelected = useMemo(() => {
    return noteMeta[note.uuid]?.isSelected === true
  }, [noteMeta, note.uuid])

  return (
    <>
      <Link
        key={note.uuid}
        href={`/workspaces/${note.workspaceId}/notes/${note.uuid}`}
        className='flex items-center justify-center group rounded-lg hover:bg-zinc-800 p-2 transition-colors duration-200'
      >
        <div className='flex items-center justify-center'>
          <ScribbleIcon
            className={clsx(
              'text-zinc-400 h-3 mr-3',
              isNoteSelected ? 'hidden' : 'group-hover:hidden'
            )}
          />
          <Checkbox
            aria-label='Select note'
            className={clsx(
              'mr-3 transition-opacity duration-200 ease-in-out h-3 w-3 mb-0.5',
              isNoteSelected ? 'block' : 'hidden group-hover:block'
            )}
            color='cyan'
            defaultChecked={false}
            checked={isNoteSelected}
            onChange={(checked: boolean) => onCheckboxClick(checked, note.uuid)}
          />
        </div>
        <div className='grow text-sm truncate text-zinc-400'>{title}</div>
        <div className='ml-3 flex-none'>
          <div className='flex items-center space-x-1 md:space-x-2 justify-center'>
            <span className='shrink-0 group-hover:text-zinc-400 text-xs text-zinc-500'>
              <Tooltip>
                <TooltipTrigger>{formatTimestamp(note.created)}</TooltipTrigger>
                <TooltipContent side='bottom'>
                  <div className='bg-zinc-900 border border-zinc-800 shadow-zinc-900 rounded px-2 py-1'>
                    <p className='text-xs text-zinc-400'>
                      Created {formatFullDate(note.created)}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>{' '}
              ·{' '}
              <Tooltip>
                <TooltipTrigger>{formatTimestamp(note.created)}</TooltipTrigger>
                <TooltipContent side='bottom'>
                  <div className='bg-zinc-900 border border-zinc-800 shadow-zinc-900 rounded px-2 py-1'>
                    <p className='text-xs text-zinc-400'>
                      Updated {formatFullDate(note.updated)}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </span>
            <div>
              <Dropdown>
                <DropdownButton plain className='h-6'>
                  <span className='sr-only'>Note options</span>
                  <EllipsisHorizontalIcon className='h-4' />
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
        </div>
      </Link>
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
    </>
  )
}

export default NotesListSectionItem
