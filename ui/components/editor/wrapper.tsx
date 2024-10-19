'use client'

import { useNoteStore } from '@/libs/providers/note-store'
import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { BlockNoteEditorProps } from '@/components/editor/blocknote'
import { PartialBlock } from '@blocknote/core'

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
  const { notes } = useNoteStore((state) => state)
  let note = useMemo(() => notes[noteUuid], [noteUuid])

  if (note == null) {
    // fetch from api
    note = {
      uuid: noteUuid,
      workspaceId: workspaceId,
      trashed: false,
      favorite: false,
      content: {
        dom: [
          {
            type: 'paragraph',
            props: {
              textColor: 'default',
              backgroundColor: 'default',
              textAlignment: 'left',
            },
            content: [
              {
                type: 'text',
                text: '',
                styles: {},
              },
            ],
          },
        ],
      },
    }
  }

  const handleOnChangeDom = (dom: PartialBlock[]) => {
    console.log('new dom', dom)
  }

  return (
    <div className='relative shrink-0 w-full grow-0 h-[calc(100vh-140px)] border border-dashed border-zinc-800 rounded-xl overflow-scroll pt-10'>
      <BlockNoteEditor
        content={note.content?.dom}
        onChangeDom={(dom) => handleOnChangeDom(dom)}
      />
    </div>
  )
}
