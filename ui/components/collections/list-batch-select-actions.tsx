'use client'

import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertActions,
} from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useCollectionMeta } from '@/libs/providers/collection-meta'
import { useCurrentWorkspaceId } from '@/queries/hooks/auth/use-current-workspace-id'
import { useTrashCollectionMulti } from '@/queries/hooks/collections'
import { TrashIcon } from '@heroicons/react/16/solid'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const CollectionsListBatchSelectActions = () => {
  const { collectionMeta, setCollectionMeta } = useCollectionMeta()
  const [isTrashConfirmAlertOpen, setIsTrashConfirmAlertOpen] = useState(false)
  const { mutate: deleteCollectionMulti } = useTrashCollectionMulti({
    onSuccess: () => {
      setIsTrashConfirmAlertOpen(false)
      toast(
        `trashed ${selectedCollectionsLen} collection` +
          (selectedCollectionsLen > 1 ? 's' : ''),
        {
          description:
            'you can restore them from trash, or delete them permanently',
        }
      )

      // clear collection meta for selected collections
      const newMeta = { ...collectionMeta }
      Object.keys(newMeta)
        .map(Number)
        .forEach((id) => {
          if (newMeta[id].isSelected) {
            delete newMeta[id]
          }
        })
      setCollectionMeta(newMeta)
    },
  })

  const wid = useCurrentWorkspaceId()

  const showActions = useMemo(() => {
    return Object.values(collectionMeta).some((meta) => meta.isSelected)
  }, [collectionMeta])

  const selectedCollectionsLen = useMemo(() => {
    return Object.values(collectionMeta).filter((meta) => meta.isSelected)
      .length
  }, [collectionMeta])

  const deselectAll = () => {
    const newMeta = { ...collectionMeta }
    Object.keys(newMeta)
      .map(Number)
      .forEach((id: number) => {
        newMeta[id].isSelected = false
      })
    setCollectionMeta(newMeta)
  }

  const deleteAllConfirm = () => {
    const cids = Object.keys(collectionMeta)
      .map(Number)
      .filter((id) => collectionMeta[id].isSelected)
    deleteCollectionMulti({ wid, cids })
  }

  const deleteAll = () => {
    setIsTrashConfirmAlertOpen(true)
  }

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
              {selectedCollectionsLen} selected{' '}
            </p>
            <Button plain onClick={deselectAll} className='text-sm h-7'>
              deselect
            </Button>
            <Button outline className='h-7 text-sm' onClick={deleteAll}>
              <TrashIcon />
            </Button>
          </div>
        </div>
      </motion.div>
      <Alert
        open={isTrashConfirmAlertOpen}
        onClose={setIsTrashConfirmAlertOpen}
      >
        <AlertTitle>
          are you sure you want to delete {selectedCollectionsLen}{' '}
          collection(s)?
        </AlertTitle>
        <AlertDescription>
          they will be moved to trash and will be there for 30 days. you can
          restore it within that period.
        </AlertDescription>
        <AlertActions>
          <Button plain onClick={() => setIsTrashConfirmAlertOpen(false)}>
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

export default CollectionsListBatchSelectActions
