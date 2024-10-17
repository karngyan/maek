'use client'

import { useNoteStore } from '@/libs/providers/note-store'
import { useMemo } from 'react'

type EditorProps = {
  workspaceId: number
  noteUuid: string
}

export const EditorWrapper = ({ workspaceId, noteUuid }: EditorProps) => {
  const { notes } = useNoteStore((state) => state)
  const note = useMemo(() => notes[noteUuid], [noteUuid])

  return <div>{JSON.stringify(note, null, ' ')}</div>
}
