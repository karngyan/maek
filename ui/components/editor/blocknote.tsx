'use client'

import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { PartialBlock } from '@blocknote/core'
import { maekDarkTheme } from '@/components/editor/theme'

export type BlockNoteEditorProps = {
  content?: PartialBlock[]
  onChangeDom?: (content: PartialBlock[]) => unknown
}

export default function BlockNoteEditor({
  content,
  onChangeDom,
}: BlockNoteEditorProps) {
  const editor = useCreateBlockNote({
    initialContent: content,
    animations: true,
    _tiptapOptions: {
      autofocus: 'end',
    },
  })

  return (
    <BlockNoteView
      onChange={() => {
        onChangeDom?.(editor.document)
      }}
      editor={editor}
      editable={true}
      theme={maekDarkTheme}
    />
  )
}
