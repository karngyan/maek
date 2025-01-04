'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { defaultNewNote } from '@/libs/utils/note'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthInfo } from '@/queries/hooks/auth/use-auth-info'
import QuickCreatePanel from '../panel'
import { Block } from '@blocknote/core'
import { notesKeys } from '@/queries/hooks/notes'

const QuickCreateInp = () => {
  const router = useRouter()
  const params = useParams<{ wid: string }>()
  const [noteUuid] = useState(() => uuidv4())
  const { data } = useAuthInfo()
  const qc = useQueryClient()

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const val = e.currentTarget.value
    if (val.trim() === '') {
      return
    }

    qc.setQueryData(notesKeys.one(+params.wid, noteUuid), {
      note: defaultNewNote(noteUuid, +params.wid, val, data!.user),
    })
    router.push(`/workspaces/${params.wid}/notes/${noteUuid}`)
  }

  const onQuickCreate = (
    dom: Block[],
    fid?: string,
    fplace?: 'end' | 'start'
  ) => {
    qc.setQueryData(notesKeys.one(+params.wid, noteUuid), {
      note: defaultNewNote(noteUuid, +params.wid, '', data!.user, dom),
    })

    let query = ''
    if (fid) {
      fplace = fplace ?? 'end'
      query = new URLSearchParams({ fid, fplace }).toString()
    }

    router.push(`/workspaces/${params.wid}/notes/${noteUuid}?${query}`)
  }

  useEffect(() => {
    router.prefetch('/workspaces/[wid]/notes/[nid]')
  }, [router])

  return (
    <div className='min-w-0 flex-1 relative'>
      <div className='overflow-hidden rounded-lg shadow-sm ring-1 ring-inset drop-shadow-md ring-zinc-800 focus-within:shadow-lg transition-shadow duration-300'>
        <label htmlFor='quick-note' className='sr-only'>
          add to your notes
        </label>
        <textarea
          id='quick-note'
          name='quick-note'
          rows={2}
          placeholder='add to your notes ...'
          className='caret-zinc-400 block w-full resize-none border-0 bg-transparent py-1.5 text-zinc-300 placeholder:text-zinc-600 focus:ring-0 text-sm leading-6'
          defaultValue={''}
          onInput={handleInput}
        />

        {/* Spacer element to match the height of the toolbar */}
        <div aria-hidden='true' className='py-2'>
          {/* Matches height of button in toolbar (1px border + 36px content height) */}
          <div className='py-px'>
            <div className='h-9' />
          </div>
        </div>

        <QuickCreatePanel onQuickCreate={onQuickCreate} />
      </div>
    </div>
  )
}

export default QuickCreateInp
