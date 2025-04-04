'use client'

import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { Block, locales } from '@blocknote/core'
import { maekDarkTheme } from '@/components/editor/theme'
import { useState } from 'react'
import { isDomEmpty } from '@/libs/utils/note'
import QuickCreatePanel from '../quick-create/panel'
import { useYDoc, useYjsProvider } from '@/libs/ysweet/react';
import { User } from '@/queries/services/auth'
import uniqolor from 'uniqolor';

export type BlockNoteEditorProps = {
  user?: User
  onChangeDom?: (content: Block[], mdContent: string) => unknown
  initialFocusOption?: {
    id: string
    placement: 'end' | 'start'
  }
}

export default function BlockNoteEditor({
  user,
  onChangeDom,
  initialFocusOption,
}: BlockNoteEditorProps) {
  const [intialFocussed, setInitialFocussed] = useState(false)
  const [showQuickCreate, setShowQuickCreate] = useState(false)

  const yDocProvider = useYjsProvider()
  const yDoc = useYDoc()
  const { color } = uniqolor(user?.email ?? 'anonymous')

  const editor = useCreateBlockNote({
    animations: true,
    _tiptapOptions: {
      autofocus: 'end',
    },
    dictionary: {
      ...locales.en,
      placeholders: {
        ...locales.en.placeholders,
        default: '',
      },
    },
    trailingBlock: false,
    collaboration: {
      provider: yDocProvider,
      fragment: yDoc.getXmlFragment('blocknote'),
      user: { name: user?.name ?? 'anonymous', color },
    }
  })

  const onChange = async () => {
    const dom = editor.document
    setShowQuickCreate(isDomEmpty(dom))
    const mdContent = await editor.blocksToMarkdownLossy(dom)
    onChangeDom?.(dom, mdContent)
  }

  return (
    <div className=''>
      <BlockNoteView
        onChange={onChange}
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
    </div>
  )
}
