import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { HashtagIcon } from '@heroicons/react/24/outline'
import { CollectionSortKeys } from '@/queries/services/collection'
import { useNoteMeta } from '@/libs/providers/note-meta'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  useAddNotesToCollection,
  useCreateCollection,
  useFetchAllCollections,
} from '@/queries/hooks/collections'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PlusIcon } from '@heroicons/react/16/solid'
import { Badge } from '@/components/ui/badge'

export const AddToCollection = ({
  open,
  onClose,
  wid,
}: {
  wid: number
  open: boolean
  onClose: () => unknown
}) => {
  const [selectedItem, setSelectedItem] = useState<{
    id: number
    name: string
  } | null>(null)
  const [query, setQuery] = useState('')

  const { noteMeta, setNoteMeta, deselectAll } = useNoteMeta()
  const { mutate: addNotesToCollection, isPending: isAddToCollectionPending } =
    useAddNotesToCollection()
  const { data: collectionInfResponse } = useFetchAllCollections(
    wid,
    CollectionSortKeys.UpdatedDsc
  )
  const { mutate: createCollection, isPending: isCollectionCreatePending } =
    useCreateCollection()
  const router = useRouter()

  const selectedNotesLen = useMemo(() => {
    return Object.values(noteMeta).filter((meta) => meta.isSelected).length
  }, [noteMeta])

  const allCollections = useMemo(() => {
    return (
      collectionInfResponse?.pages.map((page) => page.collections).flat() ?? []
    )
  }, [collectionInfResponse])

  const filteredCollections = useMemo(() => {
    if (query === '') {
      return []
    }

    return allCollections.filter((collection) =>
      collection.name.toLowerCase().includes(query.toLowerCase())
    )
  }, [allCollections, query])

  const addNotesToCollectionHandler = (collectionId: number) => {
    const noteIDs: number[] = []
    for (const key in noteMeta) {
      if (noteMeta[key].isSelected) {
        noteIDs.push(noteMeta[key].id)
      }
    }

    addNotesToCollection(
      {
        wid,
        cid: collectionId,
        nids: noteIDs,
      },
      {
        onSuccess: () => {
          onClose()
          toast(
            `added ${selectedNotesLen} note` +
              (selectedNotesLen > 1 ? 's' : '') +
              ' to collection',
            {
              description: 'you can view them in there',
              action: {
                label: 'view',
                onClick: () => {
                  router.push(`/workspaces/${wid}/collections/${collectionId}`)
                },
              },
            }
          )
          setSelectedItem(null)
          deselectAll()
        },
      }
    )
  }

  const onConfirmAddToCollection = () => {
    if (selectedItem == null) {
      return
    }

    if (selectedItem.id === -1) {
      // create new collection
      createCollection(
        { wid, name: selectedItem.name },
        {
          onSuccess: ({ collection }) => {
            addNotesToCollectionHandler(collection.id)
          },
        }
      )

      return
    }

    addNotesToCollectionHandler(selectedItem.id)
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>organize</DialogTitle>
      <DialogDescription>{`add ${selectedNotesLen} note${selectedNotesLen > 1 ? 's' : ''} to a collection`}</DialogDescription>
      <DialogBody>
        {selectedItem != null && (
          <div
            onClick={() => setSelectedItem(null)}
            className='group flex cursor-default select-none border border-zinc-800 hover:border-primary-600 shadow-sm text-zinc-300 text-sm items-center rounded-md px-3 py-2'
          >
            <HashtagIcon
              className='size-4 flex-none text-zinc-300'
              aria-hidden='true'
            />
            <span className='ml-2 flex-auto truncate'>
              {selectedItem.name}
              {selectedItem.id === -1 && (
                <Badge color='teal' className='ml-2 py-0'>
                  new
                </Badge>
              )}
            </span>
          </div>
        )}
        {selectedItem == null && (
          <Combobox
            as='div'
            onChange={(item: { id: number; name: string }) => {
              setSelectedItem(item)
              setQuery('')
            }}
            className='relative w-full'
          >
            <div className='grid grid-cols-1'>
              <ComboboxInput
                autoFocus
                className='col-start-1 rounded-lg border border-zinc-800 focus:border-primary-600 row-start-1 w-full bg-transparent pl-9 pr-3 py-2 text-white outline-hidden placeholder:text-zinc-500 text-sm'
                placeholder='add to existing or new collection...'
                onChange={(event) => setQuery(event.target.value)}
                onBlur={() => setQuery('')}
              />
              <MagnifyingGlassIcon
                className='pointer-events-none col-start-1 row-start-1 ml-3 size-4 self-center text-zinc-500'
                aria-hidden='true'
              />
            </div>
            {query !== '' && (
              <ComboboxOptions
                as='ul'
                className='absolute z-20 mt-1 max-h-80 bg-zinc-900 focus:outline-hidden rounded-lg border border-zinc-700 w-full scroll-py-2 divide-y divide-dashed divide-zinc-500/20 overflow-y-auto'
              >
                {filteredCollections.length > 0 && (
                  <li className='p-2'>
                    <h2 className='mb-2 mt-2 px-3 text-xs font-semibold text-zinc-200'>
                      collections
                    </h2>
                    <ul className='text-sm text-zinc-400'>
                      {filteredCollections.map((collection) => (
                        <ComboboxOption
                          key={collection.id}
                          value={{ id: collection.id, name: collection.name }}
                          className='group flex cursor-default select-none items-center rounded-md px-3 py-2 data-[focus]:bg-zinc-800 data-[focus]:text-white data-[focus]:outline-hidden'
                        >
                          <HashtagIcon
                            className='size-4 flex-none text-zinc-500 group-data-[focus]:text-white forced-colors:group-data-[focus]:text-[Highlight]'
                            aria-hidden='true'
                          />
                          <span className='ml-2 flex-auto truncate'>
                            {collection.name}
                          </span>
                        </ComboboxOption>
                      ))}
                    </ul>
                  </li>
                )}
                {query !== '' && (
                  <li className='p-2'>
                    <h2 className='mb-2 mt-2 px-3 text-xs font-semibold text-zinc-200'>
                      create collection
                    </h2>
                    <ul className='text-sm text-zinc-400'>
                      <ComboboxOption
                        value={{ id: -1, name: query }}
                        className='group flex cursor-default select-none items-center rounded-md px-3 py-2 data-[focus]:bg-zinc-800 data-[focus]:text-white/80 data-[focus]:outline-hidden'
                      >
                        <PlusIcon
                          className='size-4 flex-none text-zinc-500 group-data-[focus]:text-white forced-colors:group-data-[focus]:text-[Highlight]'
                          aria-hidden='true'
                        />
                        <span className='ml-2 flex-auto truncate'>
                          collection named{' '}
                          <span className='font-semibold'>{query}</span>
                        </span>
                      </ComboboxOption>
                    </ul>
                  </li>
                )}
              </ComboboxOptions>
            )}
          </Combobox>
        )}
      </DialogBody>
      <DialogActions>
        <Button plain onClick={onClose}>
          cancel
        </Button>
        <Button
          loading={isAddToCollectionPending || isCollectionCreatePending}
          disabled={selectedItem == null}
          onClick={onConfirmAddToCollection}
        >
          confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
