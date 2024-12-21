'use client'

import { useFetchAllNotes } from '@/queries/hooks/use-fetch-all-notes'
import { useParams } from 'next/navigation'
import React, { useMemo } from 'react'
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '@/components/ui/dropdown'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import dayjs from 'dayjs'
import NotesListSection from './section'
import { NoteMetaProvider } from '@/libs/providers/note-meta'
import NotesListPendingPulse from './pending-pulse'
import { Button } from '../ui/button'
import NotesListBatchSelectActions from './batch-select-actions'

const SortOptions = [
  { value: 'created_dsc', label: 'last created' },
  { value: 'updated_dsc', label: 'last modified' },
]

const yesterdayStart = dayjs().subtract(1, 'day').startOf('day').unix()
const yesterdayEnd = dayjs().subtract(1, 'day').endOf('day').unix()
const weekStart = dayjs().startOf('week').unix()
const lastWeekStart = dayjs().subtract(1, 'week').startOf('week').unix()
const monthStart = dayjs().startOf('month').unix()
const lastMonthStart = dayjs().subtract(1, 'month').startOf('month').unix()

const NotesList = () => {
  const { wid } = useParams<{ wid: string }>()
  const workspaceId = +wid
  const [sortKey, setSortKey] = React.useState('updated_dsc')

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    status,
  } = useFetchAllNotes(workspaceId, sortKey)

  const allNotes = useMemo(() => {
    return data?.pages.map((page) => page.notes).flat()
  }, [data])

  const todayNotes = useMemo(() => {
    return allNotes?.filter((note) => {
      let date = dayjs.unix(note.updated)
      if (sortKey.includes('created')) {
        date = dayjs.unix(note.created)
      }

      return date.isSame(dayjs(), 'day')
    })
  }, [allNotes, sortKey])

  const yesterdayNotes = useMemo(() => {
    return allNotes?.filter((note) => {
      let date = note.updated
      if (sortKey.includes('created')) {
        date = note.created
      }

      return date >= yesterdayStart && date <= yesterdayEnd
    })
  }, [allNotes, sortKey])

  const earlierThisWeekNotes = useMemo(() => {
    return allNotes?.filter((note) => {
      let date = note.updated
      if (sortKey.includes('created')) {
        date = note.created
      }
      return date >= weekStart && date < yesterdayStart
    })
  }, [allNotes, sortKey])

  const lastWeekNotes = useMemo(() => {
    return allNotes?.filter((note) => {
      let date = note.updated
      if (sortKey.includes('created')) {
        date = note.created
      }

      return date >= lastWeekStart && date < weekStart && date < yesterdayStart
    })
  }, [allNotes, sortKey])

  const earlierThisMonthNotes = useMemo(() => {
    return allNotes?.filter((note) => {
      let date = note.updated
      if (sortKey.includes('created')) {
        date = note.created
      }
      return (
        date >= monthStart &&
        date < lastWeekStart &&
        date < weekStart &&
        date < yesterdayStart
      )
    })
  }, [allNotes, sortKey])

  const lastMonthNotes = useMemo(() => {
    return allNotes?.filter((note) => {
      let date = note.updated
      if (sortKey.includes('created')) {
        date = note.created
      }

      return (
        date >= lastMonthStart &&
        date < monthStart &&
        date < lastWeekStart &&
        date < weekStart &&
        date < yesterdayStart
      )
    })
  }, [allNotes, sortKey])

  const olderNotes = useMemo(() => {
    return allNotes?.filter((note) => {
      let date = note.updated
      if (sortKey.includes('created')) {
        date = note.created
      }

      return (
        date < lastMonthStart &&
        date < monthStart &&
        date < lastWeekStart &&
        date < weekStart &&
        date < yesterdayStart
      )
    })
  }, [allNotes, sortKey])

  if (status === 'error') {
    return (
      <div className='test-zinc-400'>
        some error occurred while fetching your notes. try reloading?{' '}
        {JSON.stringify(error, null, 2)}
      </div>
    )
  }

  return (
    <NoteMetaProvider>
      <div className='flex flex-row justify-between items-center'>
        <h2 className='text-xl text-zinc-300 font-medium'>all notes</h2>
        <Dropdown>
          <DropdownButton plain>
            {SortOptions.find((option) => option.value === sortKey)?.label}
            <ChevronDownIcon />
          </DropdownButton>
          <DropdownMenu anchor='bottom'>
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
        <NotesListPendingPulse withHeader={false} />
      ) : (
        <div className='space-y-6 mt-6'>
          <NotesListSection title='today' notes={todayNotes} />
          <NotesListSection title='yesterday' notes={yesterdayNotes} />
          <NotesListSection
            title='earlier this week'
            notes={earlierThisWeekNotes}
          />
          <NotesListSection title='last week' notes={lastWeekNotes} />
          <NotesListSection
            title='earlier this month'
            notes={earlierThisMonthNotes}
          />
          <NotesListSection title='last month' notes={lastMonthNotes} />
          <NotesListSection title='older' notes={olderNotes} />
        </div>
      )}
      {isFetchingNextPage ? <NotesListPendingPulse withHeader={false} /> : null}
      {hasNextPage ? (
        <div className='flex py-12 items-center justify-center'>
          <Button outline onClick={() => fetchNextPage()}>
            load more
          </Button>
        </div>
      ) : null}
      <NotesListBatchSelectActions />
    </NoteMetaProvider>
  )
}

export default NotesList
