'use client'

import React, { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { BlockNoteEditorProps } from '@/components/editor/blocknote'
import { Block } from '@blocknote/core'
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
  LinkIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'
import { Button } from '@/components/ui/button'
import { StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '@/components/ui/dropdown'
import { toast } from 'sonner'
import {
  useFetchCollectionsForNote,
  useFetchNote,
  useUpsertNote,
} from '@/queries/hooks/notes'
import { useDebounceCallback } from '@react-hook/debounce'
import dayjs from 'dayjs'
import { Text } from '@/components/ui/text'
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { useDeleteNote } from '@/queries/hooks/notes'
import relativeTime from 'dayjs/plugin/relativeTime'
import { getHasMeta, getNoteTitle } from '@/libs/utils/note'
import NotFound from '@/app/not-found'
import { formatTimestamp } from '@/libs/utils/time'
import { useRouter } from 'next/navigation'
import { OrganizeNote } from './organize-note'
import { Spinner } from '../ui/spinner'
import { Badge } from '../ui/badge'

type EditorWrapperProps = {
  workspaceId: number
  noteUuid: string
  initialFocusOption?: {
    id: string
    placement: 'end' | 'start'
  }
  exitHref?: string
  onUpsertNote?: (noteId: number) => void
}

const BlockNoteEditor = dynamic<BlockNoteEditorProps>(
  () => import('./blocknote'),
  { ssr: false }
)

export const EditorWrapper = ({
  workspaceId,
  noteUuid,
  initialFocusOption,
  exitHref,
  onUpsertNote,
}: EditorWrapperProps) => {
  const router = useRouter()
  const { data, isPending, isError } = useFetchNote(workspaceId, noteUuid)
  const [isDeleteConfirmAlertOpen, setIsDeleteConfirmAlertOpen] =
    useState(false)
  const exitHrefPath = exitHref ?? `/workspaces/${workspaceId}/notes`
  const [currentDom, setCurrentDom] = useState<Block[]>([])

  const { mutate: upsertNote } = useUpsertNote()
  const { mutate: deleteNote } = useDeleteNote({
    onSuccess: () => {
      router.replace(`/workspaces/${workspaceId}/notes`)
    },
  })
  const note = useMemo(() => data?.note, [data])
  const { data: collectionsForNoteResponse } = useFetchCollectionsForNote(
    workspaceId,
    note?.uuid ?? '',
    note != null
  )

  const collectionsForNote = useMemo(() => {
    return collectionsForNoteResponse?.collections ?? []
  }, [collectionsForNoteResponse])

  const ts = useMemo(() => {
    if (!note) return { updated: '', created: '' }
    dayjs.extend(relativeTime)
    return {
      updated: formatTimestamp(note.updated),
      created: formatTimestamp(note.created),
    }
  }, [note])

  const debouncedUpsert = useDebounceCallback(
    (dom: Block[], mdContent: string) => {
      if (!note) return
      const newNote = {
        ...note,
        updated: dayjs().unix(),
        content: {
          ...note.content,
          dom,
        },
      }

      const hasMeta = getHasMeta(newNote) // a little too expensive, may be we should move this to the server or use a more efficient way to update this

      upsertNote(
        {
          ...newNote,
          ...hasMeta,
          mdContent,
        },
        {
          onSettled: (noteResp) => {
            if (onUpsertNote && noteResp) {
              onUpsertNote(noteResp.note.id)
            }
          },
        }
      )
    },
    600
  )

  const handleOnChangeDom = (dom: Block[], mdContent: string) => {
    debouncedUpsert(dom, mdContent)
    setCurrentDom(dom)
  }

  const title = useMemo(() => {
    if (currentDom.length > 0) return getNoteTitle(currentDom)
    return getNoteTitle(note?.content?.dom ?? [])
  }, [currentDom, note])

  const onCopyMaekLinkClick = () => {
    const url = `${window.location.origin}/workspaces/${workspaceId}/notes/${noteUuid}`
    navigator.clipboard.writeText(url).then(() => {
      toast('link copied to clipboard', {
        description: url,
      })
    })
  }

  const onDeleteClick = () => {
    if (!note) return
    setIsDeleteConfirmAlertOpen(true)
  }

  const onDeleteConfirm = () => {
    if (!note) return
    deleteNote({ workspaceId, noteUuid })
  }

  const onFavoriteClick = () => {
    if (!note) return

    const currentFavorite = note.favorite ?? false
    upsertNote({
      ...note,
      favorite: !currentFavorite,
      updated: dayjs().unix(),
    })
  }

  // if the note is not found, show a 404 page
  // but only if the note is not new
  // if its new and created via quick create, show the editor and wait for the user to edit it so we can save it
  if (isError && !(note?.isNew === true)) {
    return <NotFound embed={true} statusCode={404} />
  }

  if (!note) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Spinner className='dark:text-zinc-800 h-12' />
      </div>
    )
  }

  return (
    <div className='relative shrink-0 w-full grow-0 min-h-full'>
      <div className='sticky top-0 border-b border-dashed border-zinc-800 z-50 backdrop-blur-xs bg-zinc-900/60 flex flex-row justify-between p-3'>
        <div className='flex items-center overflow-hidden space-x-1'>
          <Button plain className='h-8' href={exitHrefPath}>
            <ArrowLeftIcon className='h-4' />
          </Button>
          <button className='flex items-center space-x-2'>
            <div className='p-2 bg-white/10 rounded-lg shrink-0'>
              <DocumentTextIcon className='h-4 text-zinc-400' />
            </div>
            <Text className='text-sm text-zinc-200 truncate'>
              {title.trim() !== '' ? title : 'untitled note'}
            </Text>
          </button>
        </div>
        <div className='ml-2 inline-flex space-x-1 items-center justify-center'>
          <div className='hidden sm:flex'>
          <OrganizeNote wid={workspaceId} note={note} />
          </div>
          <Button plain onClick={onFavoriteClick} className='h-8'>
            {note?.favorite ? (
              <StarIconSolid className='h-6' />
            ) : (
              <StarIcon className='h-6' />
            )}
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
      {isPending ? (
        <div className='space-y-4 w-full p-8'>
          <div className='h-6 animate-pulse bg-zinc-800 rounded-lg w-2/12'></div>
          <div className='h-6 animate-pulse bg-zinc-800 rounded-lg w-4/12'></div>
          <div className='h-6 animate-pulse bg-zinc-800 rounded-lg w-8/12'></div>
          <div className='h-6 animate-pulse bg-zinc-800 rounded-lg w-12/12'></div>
        </div>
      ) : (
        <>
          <div className='pl-[3.3rem] pt-6'>
            <Text className='text-xs'>{`${ts.created} -- ${ts.updated}`}</Text>
            {collectionsForNote.length > 0 && (
              <div className='hidden sm:flex flex-row space-x-2'>
                {collectionsForNote.slice(0, 4).map((collection) => (
                  <Badge key={collection.id} className='text-xs' color='teal'>
                    {collection.name}
                  </Badge>
                ))}
                {collectionsForNote.length > 4 && (
                  <Badge className='text-xs' color='zinc'>
                    +{collectionsForNote.length - 4}
                  </Badge>
                )}
              </div>
            )}
          </div>
          <BlockNoteEditor
            content={note?.content?.dom}
            onChangeDom={handleOnChangeDom}
            initialFocusOption={initialFocusOption}
          />
        </>
      )}
      <Alert
        open={isDeleteConfirmAlertOpen}
        onClose={setIsDeleteConfirmAlertOpen}
      >
        <AlertTitle>are you sure you want to delete this note?</AlertTitle>
        <AlertDescription>
          the note will be moved to trash and will be there for 30 days. you can
          restore it within that period.
        </AlertDescription>
        <AlertActions>
          <Button plain onClick={() => setIsDeleteConfirmAlertOpen(false)}>
            cancel
          </Button>
          <Button color='red' onClick={onDeleteConfirm}>
            delete
          </Button>
        </AlertActions>
      </Alert>
    </div>
  )
}
