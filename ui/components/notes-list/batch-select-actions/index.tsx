'use client'

import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertActions,
} from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/hooks/use-toast'
import { useNoteMeta } from '@/libs/providers/note-meta'
import { useCurrentWorkspaceId } from '@/queries/hooks/auth/use-current-workspace-id'
import { useDeleteNoteMulti } from '@/queries/hooks/notes'
import { TrashIcon } from '@heroicons/react/16/solid'
import { useMemo, useState } from 'react'
import { Squares2X2Icon } from '@heroicons/react/24/outline'
import { useAddNotesToCollection } from '@/queries/hooks/collections'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useHotkeys } from 'react-hotkeys-hook'

const NotesListBatchSelectActions = () => {
  const { noteMeta, setNoteMeta } = useNoteMeta()
  const { toast } = useToast()
  const [isDeleteConfirmAlertOpen, setIsDeleteConfirmAlertOpen] =
    useState(false)
  const { mutate: deleteNoteMulti } = useDeleteNoteMulti({
    onSuccess: () => {
      setIsDeleteConfirmAlertOpen(false)
      toast({
        title:
          `trashed ${selectedNotesLen} note` +
          (selectedNotesLen > 1 ? 's' : ''),
        description:
          'you can restore them from trash, or delete them permanently',
      })

      // clear note meta for selected notes
      const newMeta = { ...noteMeta }
      Object.keys(newMeta).forEach((uuid) => {
        if (newMeta[uuid].isSelected) {
          delete newMeta[uuid]
        }
      })
      setNoteMeta(newMeta)
    },
  })
  const { mutate: addNotesToCollection } = useAddNotesToCollection()

  const wid = useCurrentWorkspaceId()

  const showActions = useMemo(() => {
    return Object.values(noteMeta).some((meta) => meta.isSelected)
  }, [noteMeta])

  const selectedNotesLen = useMemo(() => {
    return Object.values(noteMeta).filter((meta) => meta.isSelected).length
  }, [noteMeta])

  const deselectAll = () => {
    const newMeta = { ...noteMeta }
    Object.keys(newMeta).forEach((uuid) => {
      newMeta[uuid].isSelected = false
    })
    setNoteMeta(newMeta)
  }

  const deleteAllConfirm = () => {
    const selectedUuids = Object.keys(noteMeta).filter(
      (uuid) => noteMeta[uuid].isSelected
    )
    deleteNoteMulti({ workspaceId: wid, noteUuids: selectedUuids })
  }

  const deleteAll = () => {
    setIsDeleteConfirmAlertOpen(true)
  }

  const onAddToCollectionClick = () => {
    const noteIDs = []
    for (const key in noteMeta) {
      if (noteMeta[key].isSelected) {
        noteIDs.push(noteMeta[key].id)
      }
    }

    // TODO implement more
  }

  useHotkeys('esc', () => {
    if (!showActions) {
      return
    }

    // alert is handled by headless ui
    if (isDeleteConfirmAlertOpen) {
      return
    }

    deselectAll()
  })

  if (!showActions) {
    return null
  }

  return (
    <>
      <div className='animate-in z-10 slide-in-from-bottom fixed inset-x-0 bottom-0'>
        <div className='flex items-center justify-center mb-12'>
          <div className='bg-zinc-900 flex space-x-4 flex-row items-center justify-center shadow-lg border border-zinc-800 rounded-lg px-4 py-2'>
            <p className='text-zinc-400 text-sm'>
              {' '}
              {selectedNotesLen} selected{' '}
            </p>
            <Button plain onClick={deselectAll} className='text-sm h-7'>
              deselect
            </Button>
            <div className='space-x-2 border-l border-zinc-800 pl-4 '>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    outline
                    className='h-7 text-sm'
                    onClick={onAddToCollectionClick}
                  >
                    <Squares2X2Icon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className='bg-zinc-900 border border-zinc-800 shadow-zinc-900 rounded px-2 py-1'>
                    <p className='text-xs text-zinc-400'>add to collection</p>
                  </div>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button outline className='h-7 text-sm' onClick={deleteAll}>
                    <TrashIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className='bg-zinc-900 border border-zinc-800 shadow-zinc-900 rounded px-2 py-1'>
                    <p className='text-xs text-zinc-400'>delete</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <Alert
        open={isDeleteConfirmAlertOpen}
        onClose={setIsDeleteConfirmAlertOpen}
      >
        <AlertTitle>
          are you sure you want to delete {selectedNotesLen} note(s)?
        </AlertTitle>
        <AlertDescription>
          they will be moved to trash and will be there for 30 days. you can
          restore it within that period.
        </AlertDescription>
        <AlertActions>
          <Button plain onClick={() => setIsDeleteConfirmAlertOpen(false)}>
            cancel
          </Button>
          <Button color='red' onClick={deleteAllConfirm}>
            delete
          </Button>
        </AlertActions>
      </Alert>
    </>
  )
}

export default NotesListBatchSelectActions
