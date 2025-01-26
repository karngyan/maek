import { Note } from '@/queries/services/note'
import {
  CheckIcon,
  HashtagIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/16/solid'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/react'
import { motion } from 'motion/react'
import { Button } from '../ui/button'
import { useFetchAllCollections } from '@/queries/hooks/collections'
import { CollectionSortKeys } from '@/queries/services/collection'
import { useMemo, useState } from 'react'
import {
  useAddCollectionsToNote,
  useFetchCollectionsForNote,
  useRemoveCollectionsFromNote,
} from '@/queries/hooks/notes'

export const OrganizeNote = ({ wid, note }: { wid: number; note: Note }) => {
  const [query, setQuery] = useState('')
  const { mutate: addCollectionsToNote, isPending: isAddCollectionPending } =
    useAddCollectionsToNote()
  const {
    mutate: removeCollectionsFromNote,
    isPending: isRemoveCollectionPending,
  } = useRemoveCollectionsFromNote()

  const { data: collectionInfResponse, isPending: isAllCollectionsPending } =
    useFetchAllCollections(wid, CollectionSortKeys.UpdatedDsc)
  const {
    data: collectionsForNoteResponse,
    isPending: isNoteCollectionsPending,
  } = useFetchCollectionsForNote(wid, note.uuid)

  const allCollections = useMemo(() => {
    return (
      collectionInfResponse?.pages.map((page) => page.collections).flat() ?? []
    )
  }, [collectionInfResponse])

  const collectionsForNote = useMemo(() => {
    return collectionsForNoteResponse?.collections ?? []
  }, [collectionsForNoteResponse])

  const filteredCollections = useMemo(() => {
    return allCollections
      .filter((collection) =>
        collection.name.toLowerCase().includes(query.toLowerCase())
      )
      .map((collection) => {
        const isNoteInCollection =
          collectionsForNote?.find((c) => c.id === collection.id) != null
        return {
          ...collection,
          isNoteInCollection,
        }
      })
  }, [allCollections, collectionsForNote, query])

  return (
    <Listbox
      as='div'
      value={collectionsForNote}
      onChange={(selectedCollections) => {
        // clicks are one by one, so its always a single item 
        // that will be added or removed
        
        const toAdd = selectedCollections.filter(
          (sc) => !collectionsForNote.some((c) => c.id === sc.id)
        )

        const toRemove = collectionsForNote.filter(
          (c) => !selectedCollections.some((sc) => sc.id === c.id)
        )

        if (toAdd.length > 0) {
          addCollectionsToNote({
            wid,
            noteUuid: note.uuid,
            cids: toAdd.map((c) => c.id),
          })
        }

        if (toRemove.length > 0) {
          removeCollectionsFromNote({
            wid,
            noteUuid: note.uuid,
            cids: toRemove.map((c) => c.id),
          })
        }
      }}
      className='relative'
      multiple
    >
      <ListboxButton
        as={Button}
        plain
        className='h-8'
      >
        <HashtagIcon />
      </ListboxButton>
      <ListboxOptions
        as='ul'
        className='absolute shadow-lg shadow-zinc-950/40 w-80 right-0 origin-top-right z-20 mt-1 max-h-80 bg-zinc-900 focus:outline-hidden rounded-lg border border-zinc-700 scroll-py-2 divide-y divide-dashed divide-zinc-500/20 overflow-y-auto'
      >
        <div
          // https://github.com/facebook/react/issues/11387
          onKeyDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onFocus={(e) => e.stopPropagation()}
          onMouseOver={(e) => e.stopPropagation()}
          className='flex py-3 w-full flex-row items-center space-x-3'
        >
          <MagnifyingGlassIcon
            aria-hidden='true'
            className='pointer-events-none col-start-1 row-start-1 ml-5 size-4 self-center text-zinc-400'
          />
          <input
            id='search-collection'
            name='search_collection'
            type='text'
            placeholder='search collections ...'
            className='bg-zinc-900 grow mr-3 text-white placeholder-zinc-600 focus:outline-none sm:text-sm/6'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {filteredCollections.length > 0 && (
          <li className='p-2'>
            <ul className='text-sm text-zinc-400'>
              {filteredCollections.map((collection) => (
                <ListboxOption
                  key={collection.id}
                  value={collection}
                  className='group flex cursor-default select-none items-center rounded-md px-3 py-2 data-[focus]:bg-zinc-800 data-[focus]:text-white data-[focus]:outline-hidden'
                >
                  <HashtagIcon
                    className='size-4 flex-none text-zinc-500 group-data-[focus]:text-white forced-colors:group-data-[focus]:text-[Highlight]'
                    aria-hidden='true'
                  />
                  <span className='ml-2 flex-auto truncate'>
                    {collection.name}
                  </span>
                  {collection.isNoteInCollection && (
                    <CheckIcon className='h-4 text-primary-600 group-data-[focus]:text-white' />
                  )}
                </ListboxOption>
              ))}
            </ul>
          </li>
        )}
        {(isAddCollectionPending ||
          isNoteCollectionsPending ||
          isAllCollectionsPending ||
          isRemoveCollectionPending) && (
          <motion.div
            className='absolute w-full bottom-0 left-0 right-0 h-0.5 bg-teal-600'
            style={{ width: '20%' }}
            animate={{
              x: [0, 300],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}
      </ListboxOptions>
    </Listbox>
  )
}
