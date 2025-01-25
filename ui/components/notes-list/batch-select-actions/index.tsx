'use client'

import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertActions,
} from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useNoteMeta } from '@/libs/providers/note-meta'
import { useCurrentWorkspaceId } from '@/queries/hooks/auth/use-current-workspace-id'
import { useDeleteNoteMulti } from '@/queries/hooks/notes'
import { HashtagIcon, TrashIcon } from '@heroicons/react/16/solid'
import { useMemo, useState } from 'react'
import {
  SimpleTooltipContent,
  Tooltip,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useHotkeys } from 'react-hotkeys-hook'
import { motion } from 'framer-motion'
import { AddToCollection } from './add-to-collection'

const NotesListBatchSelectActions = () => {
  const { noteMeta, setNoteMeta, deselectAll } = useNoteMeta()
  const wid = useCurrentWorkspaceId()

  const [isDeleteConfirmAlertOpen, setIsDeleteConfirmAlertOpen] =
    useState(false)
  const [isAddToCollectionDialogOpen, setIsAddToCollectionDialogOpen] =
    useState(false)


  const { mutate: deleteNoteMulti } = useDeleteNoteMulti({
    onSuccess: () => {
      setIsDeleteConfirmAlertOpen(false)
      toast(
        `trashed ${selectedNotesLen} note` + (selectedNotesLen > 1 ? 's' : ''),
        {
          description:
            'you can restore them from trash, or delete them permanently',
        }
      )

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

  const showActions = useMemo(() => {
    return Object.values(noteMeta).some((meta) => meta.isSelected)
  }, [noteMeta])

  const selectedNotesLen = useMemo(() => {
    return Object.values(noteMeta).filter((meta) => meta.isSelected).length
  }, [noteMeta])

  const deleteAllConfirm = () => {
    const selectedUuids = Object.keys(noteMeta).filter(
      (uuid) => noteMeta[uuid].isSelected
    )
    deleteNoteMulti({ workspaceId: wid, noteUuids: selectedUuids })
  }

  const deleteAll = () => {
    setIsDeleteConfirmAlertOpen(true)
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
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
        className='z-10 fixed inset-x-0 bottom-0'
      >
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
                    onClick={() => setIsAddToCollectionDialogOpen(true)}
                  >
                    <HashtagIcon />
                  </Button>
                </TooltipTrigger>
                <SimpleTooltipContent label='add to collection' />
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button outline className='h-7 text-sm' onClick={deleteAll}>
                    <TrashIcon />
                  </Button>
                </TooltipTrigger>
                <SimpleTooltipContent label='delete' />
              </Tooltip>
            </div>
          </div>
        </div>
      </motion.div>
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
      <AddToCollection
        open={isAddToCollectionDialogOpen}
        onClose={() => setIsAddToCollectionDialogOpen(false)}
        wid={wid}
      />
    </>
  )
}

export default NotesListBatchSelectActions
