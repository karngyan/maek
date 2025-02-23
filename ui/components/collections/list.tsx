'use client'

import { useCurrentWorkspaceId } from '@/queries/hooks/auth/use-current-workspace-id'
import {
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'
import { Strong, Text } from '@/components/ui/text'
import {
  useFetchAllCollections,
  useTrashCollection,
} from '@/queries/hooks/collections'
import CollectionsListPendingPulse from '@/components/collections/list-pending-pulse'
import FetchFailedPanel from '@/components/fetch-failed-panel'
import React, { useMemo, useState } from 'react'
import { Collection, CollectionSortKeys } from '@/queries/services/collection'
import { Button } from '@/components/ui/button'
import {
  CollectionMetaProvider,
  useCollectionMeta,
} from '@/libs/providers/collection-meta'
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '@/components/ui/dropdown'
import { Link } from '@/components/ui/link'
import { Squares2X2Icon } from '@heroicons/react/24/outline'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatFullDate, formatTimestamp } from '@/libs/utils/time'
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { Divider } from '@/components/ui/divider'
import CollectionsListBatchSelectActions from '@/components/collections/list-batch-select-actions'
import { cn } from '@/libs/utils'

const SortOptions = [
  { value: CollectionSortKeys.UpdatedDsc, label: 'last modified' },
  { value: CollectionSortKeys.UpdatedAsc, label: 'first modified' },
  { value: CollectionSortKeys.NameAsc, label: 'name a-z' },
  { value: CollectionSortKeys.NameDsc, label: 'name z-a' },
]

export default function CollectionsList() {
  const wid = useCurrentWorkspaceId()
  const [sortKey, setSortKey] = useState<CollectionSortKeys>(
    CollectionSortKeys.UpdatedDsc
  )

  const {
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isPending,
    isError,
  } = useFetchAllCollections(wid, sortKey)

  const allCollections = useMemo(() => {
    return data?.pages.map((page) => page.collections).flat()
  }, [data])

  if (isError) {
    return (
      <div className='my-6'>
        <FetchFailedPanel
          onReload={() => {
            void refetch()
          }}
        />
      </div>
    )
  }

  if (allCollections?.length === 0) {
    return (
      <>
        <div className='py-64 flex items-center justify-center flex-col'>
          <EllipsisHorizontalIcon className='h-6 text-zinc-500' />
          <Text>no items here yet</Text>
        </div>
      </>
    )
  }

  return (
    <CollectionMetaProvider>
      <div className='mt-10 flex flex-row justify-end items-center'>
        <Dropdown>
          <DropdownButton plain>
            {SortOptions.find((option) => option.value === sortKey)?.label}
            <ChevronDownIcon />
          </DropdownButton>
          <DropdownMenu anchor='bottom end'>
            {SortOptions.map((option) => (
              <DropdownItem
                key={option.value}
                onClick={() => setSortKey(option.value)}
              >
                {option.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
      {isPending ? (
        <div className='mt-6'>
          <CollectionsListPendingPulse />
        </div>
      ) : (
        allCollections?.map((collection) => (
          <div key={collection.id}>
            <Row collection={collection} />
          </div>
        ))
      )}
      {isFetchingNextPage ? <CollectionsListPendingPulse /> : null}
      {hasNextPage ? (
        <div className='flex py-12 items-center justify-center'>
          <Button outline onClick={() => fetchNextPage()}>
            load more
          </Button>
        </div>
      ) : null}
      <CollectionsListBatchSelectActions />
    </CollectionMetaProvider>
  )
}

type RowProps = {
  collection: Collection
}

function Row({ collection }: RowProps) {
  const { collectionMeta, setCollectionMeta } = useCollectionMeta()
  const [isTrashConfirmAlertOpen, setIsTrashConfirmAlertOpen] = useState(false)
  const { mutate: trashCollection } = useTrashCollection({
    onSuccess: () => {
      setIsTrashConfirmAlertOpen(false)
    },
  })

  const name = useMemo(() => {
    const { name } = collection
    const trimmedName = name.trim()

    if (trimmedName === '') {
      return 'untitled collection'
    }

    return trimmedName
  }, [collection])

  const isSelected = useMemo(() => {
    return collectionMeta[collection.id]?.isSelected === true
  }, [collectionMeta, collection.id])

  const onCheckboxClick = (checked: boolean, id: number) => {
    const currentState = collectionMeta[id]?.isSelected === true
    if (currentState === checked) {
      return
    }

    setCollectionMeta({
      ...collectionMeta,
      [id]: {
        ...collectionMeta[id],
        isSelected: checked,
      },
    })
  }

  const onTrashClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (collection == null) return
    setIsTrashConfirmAlertOpen(true)
  }

  const onTrashConfirm = () => {
    if (collection == null) return
    trashCollection({ wid: collection.workspaceId, cid: collection.id })
  }

  return (
    <>
      <Link
        href={`/workspaces/${collection.workspaceId}/collections/${collection.id}`}
        className='flex items-center justify-center group rounded-lg hover:bg-zinc-800 p-2 transition-colors duration-200'
      >
        <div className='flex items-center justify-center mr-3'>
          <Squares2X2Icon
            className={cn(
              'text-zinc-400 h-4',
              isSelected ? 'hidden' : 'group-hover:hidden'
            )}
          />
          <Checkbox
            aria-label='Select note'
            className={cn(
              'transition-opacity duration-200 ease-in-out h-4 w-4 mb-0.5',
              isSelected ? 'block' : 'hidden group-hover:block'
            )}
            color='primary'
            defaultChecked={false}
            checked={isSelected}
            onChange={(checked: boolean) =>
              onCheckboxClick(checked, collection.id)
            }
          />
        </div>
        <div className='grow text-sm truncate text-zinc-400'>{name}</div>
        <div className='ml-3 flex-none'>
          <div className='flex items-center space-x-1 md:space-x-2 justify-center'>
            <span className='shrink-0 group-hover:text-zinc-400 text-xs text-zinc-500'>
              <Tooltip>
                <TooltipTrigger>
                  {formatTimestamp(collection.created)}
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                  <div className='bg-zinc-900 border border-zinc-800 shadow-zinc-900 rounded-sm px-2 py-1'>
                    <p className='text-xs text-zinc-400'>
                      Created {formatFullDate(collection.created)}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>{' '}
              ·{' '}
              <Tooltip>
                <TooltipTrigger>
                  {formatTimestamp(collection.created)}
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                  <div className='bg-zinc-900 border border-zinc-800 shadow-zinc-900 rounded-sm px-2 py-1'>
                    <p className='text-xs text-zinc-400'>
                      Updated {formatFullDate(collection.updated)}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </span>
            <div>
              <Dropdown>
                <DropdownButton plain className='h-6'>
                  <span className='sr-only'>Note options</span>
                  <EllipsisHorizontalIcon className='h-4' />
                </DropdownButton>
                <DropdownMenu anchor='bottom end'>
                  <DropdownItem onClick={onTrashClick}>
                    <TrashIcon />
                    delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
      </Link>
      <Alert
        open={isTrashConfirmAlertOpen}
        onClose={setIsTrashConfirmAlertOpen}
      >
        <AlertTitle>
          are you sure you want to delete{' '}
          <Strong className='underline underline-offset-2'>{name}</Strong>?
        </AlertTitle>
        <AlertDescription>
          the collection will be moved to trash and will be there for 30 days.
          you can restore it within that period.
        </AlertDescription>
        <Divider className='mt-4' soft />
        <AlertDescription>
          💡 the notes in the collection will not be deleted.
        </AlertDescription>
        <AlertActions>
          <Button plain onClick={() => setIsTrashConfirmAlertOpen(false)}>
            cancel
          </Button>
          <Button color='red' onClick={onTrashConfirm}>
            delete
          </Button>
        </AlertActions>
      </Alert>
    </>
  )
}
