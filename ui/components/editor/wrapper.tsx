'use client'

import React from 'react'
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
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '@/components/ui/dropdown'
import { useToast } from '@/components/ui/hooks/use-toast'
import { useFetchNote } from '@/queries/hooks/use-fetch-note'

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
  const note = data?.note

  const handleOnChangeDom = (dom: PartialBlock[]) => {
    console.log('new dom', dom)
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
    // trigger trash update and show toast that it'll be there for 30 days
  }

  return (
    <div className='max-w-4xl mx-auto relative shrink-0 w-full grow-0 h-[calc(100vh-144px)] border border-dashed border-zinc-800 rounded-xl overflow-scroll'>
      <div className='flex flex-row justify-between p-6'>
        <Button plain className='h-8' href={`/workspaces/${workspaceId}`}>
          <ArrowLeftIcon className='h-6' />
          <span className='text-zinc-400'>exit</span>
        </Button>
        <div className='inline-flex space-x-0.5 items-center justify-center'>
          <Button plain className='h-8'>
            <StarIcon className='h-6' />
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
      <BlockNoteEditor
        content={note?.content?.dom}
        onChangeDom={(dom) => handleOnChangeDom(dom)}
      />
    </div>
  )
}
