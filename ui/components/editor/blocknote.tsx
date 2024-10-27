'use client'

import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { Block, locales } from '@blocknote/core'
import { maekDarkTheme } from '@/components/editor/theme'
import { useState } from 'react'
import { isDomEmpty } from '@/libs/utils/note'
import QuickCreatePanel from '../quick-create/panel'

export type BlockNoteEditorProps = {
  content?: Block[]
  onChangeDom?: (content: Block[]) => unknown
  initialFocusOption?: {
    id: string
    placement: 'end' | 'start'
  }
}

export default function BlockNoteEditor({
  content,
  onChangeDom,
  initialFocusOption,
}: BlockNoteEditorProps) {
  const [intialFocussed, setInitialFocussed] = useState(false)
  const [showQuickCreate, setShowQuickCreate] = useState(false)

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
    trailingBlock: true,
  })

  return (
    <>
      <BlockNoteView
        onChange={() => {
          const dom = editor.document
          setShowQuickCreate(isDomEmpty(dom))
          onChangeDom?.(dom)
        }}
        onSelectionChange={() => {
          if (intialFocussed) {
            return
          }
          setInitialFocussed(true)

          if (editor == null || initialFocusOption == null) {
            return
          }

          try {
            const { id, placement } = initialFocusOption
            editor.setTextCursorPosition(id, placement)
          } catch (e) {
            console.error('Failed to set initial focus', e)
          }
        }}
        editor={editor}
        editable={true}
        theme={maekDarkTheme}
      />
      {showQuickCreate && (
        <QuickCreatePanel
          onQuickCreate={(dom: Block[], focusId, focusPlacement) => {
            editor.replaceBlocks(editor.document, dom)
            if (focusId) {
              editor.focus()
              editor.setTextCursorPosition(focusId, focusPlacement ?? 'end')
            }
          }}
        />
      )}
    </>
  )
}
