'use client'

import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { locales, PartialBlock } from '@blocknote/core'
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
    dictionary: {
      ...locales.en,
      placeholders: {
        ...locales.en.placeholders,
        default: 'enter text or type / for commands',
      },
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