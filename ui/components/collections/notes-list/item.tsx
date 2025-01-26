'use client'

import { getNoteTitle } from '@/libs/utils/note'
import { Note } from '@/queries/services/note'
import Link from 'next/link'
import React, { useMemo } from 'react'
import ScribbleIcon from '@/components/ui/icons/scribble'
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
import { toast } from 'sonner'
import { useRemoveNotesFromCollection } from '@/queries/hooks/collections'

type CollectionNotesListItemProps = {
  cid: number
  note: Note
}

const CollectionNotesListItem = ({ note, cid }: CollectionNotesListItemProps) => {
  const { mutate: removeNotesFromCollection } = useRemoveNotesFromCollection()

  const title = useMemo(() => {
    return getNoteTitle(note.content.dom ?? [])
  }, [note])

  const onCopyMaekLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = `${window.location.origin}/workspaces/${note.workspaceId}/notes/${note.uuid}`
    navigator.clipboard.writeText(url).then(() => {
      toast('link copied to clipboard', {
        description: url,
      })
    })
  }

  const onRemoveNoteFromCollection = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!note) return
    if (cid <= 0) return

    let removePromiseResolve: () => void
    const removePromise = new Promise<void>((resolve) => {
      removePromiseResolve = resolve
    })

    removeNotesFromCollection({ wid: note.workspaceId, cid, nids: [note.id] }, {
      onSuccess: () => {
        if (removePromiseResolve) removePromiseResolve()
      },
      onError: (error) => {
        toast.error('failed to remove note from collection', {
          description: error.toString(),
        })
      }
    })

    toast.promise(removePromise, {
      loading: 'detaching note from collection...',
      success: () => 'note detached from collection.',
    })
  }

  return (
    <>
      <Link
        key={note.uuid}
        href={`/workspaces/${note.workspaceId}/notes/${note.uuid}?cid=${cid}`}
        className='flex items-center justify-center group rounded-lg hover:bg-zinc-800 p-2 transition-colors duration-200'
      >
        <div className='flex items-center justify-center'>
          <ScribbleIcon
            className='text-zinc-400 h-3 mr-3'
          />
        </div>
        <div className='grow text-sm truncate text-zinc-400'>{title}</div>
        <div className='ml-3 flex-none'>
          <div className='flex items-center space-x-1 md:space-x-2 justify-center'>
            <span className='shrink-0 group-hover:text-zinc-400 text-xs text-zinc-500'>
              <Tooltip>
                <TooltipTrigger>{formatTimestamp(note.created)}</TooltipTrigger>
                <TooltipContent side='bottom'>
                  <div className='bg-zinc-900 border border-zinc-800 shadow-zinc-900 rounded-sm px-2 py-1'>
                    <p className='text-xs text-zinc-400'>
                      created {formatFullDate(note.created)}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>{' '}
              ·{' '}
              <Tooltip>
                <TooltipTrigger>{formatTimestamp(note.created)}</TooltipTrigger>
                <TooltipContent side='bottom'>
                  <div className='bg-zinc-900 border border-zinc-800 shadow-zinc-900 rounded-sm px-2 py-1'>
                    <p className='text-xs text-zinc-400'>
                      updated {formatFullDate(note.updated)}
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
                  <DropdownItem onClick={onRemoveNoteFromCollection}>
                    <TrashIcon />
                    remove from collection
                  </DropdownItem>
                  <DropdownItem onClick={onCopyMaekLinkClick}>
                    <LinkIcon />
                    copy maek link
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}

export default CollectionNotesListItem