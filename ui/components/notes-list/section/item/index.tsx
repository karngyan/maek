'use client'

import { getNoteTitle } from '@/libs/utils/note'
import { Note } from '@/queries/services/note-service'
import Link from 'next/link'
import { useMemo } from 'react'
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
import { EllipsisHorizontalIcon } from '@heroicons/react/16/solid'
import { formatTimestamp } from '@/libs/utils/time'

type NotesListSectionItemProps = {
  note: Note
}

const NotesListSectionItem = ({ note }: NotesListSectionItemProps) => {
  const { noteMeta, setNoteMeta } = useNoteMeta()

  const title = useMemo(() => {
    return getNoteTitle(note)
  }, [note])

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

  const isNoteSelected = useMemo(() => {
    return noteMeta[note.uuid]?.isSelected === true
  }, [noteMeta, note.uuid])

  return (
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
            {formatTimestamp(note.updated)}
          </span>
          <div>
            <Dropdown>
              <DropdownButton plain className='h-6'>
                <span className='sr-only'>Note options</span>
                <EllipsisHorizontalIcon className='h-4' />
              </DropdownButton>
              <DropdownMenu anchor='bottom end'>
                <DropdownItem href='/users/1'>View</DropdownItem>
                <DropdownItem href='/users/1/edit'>Edit</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default NotesListSectionItem
