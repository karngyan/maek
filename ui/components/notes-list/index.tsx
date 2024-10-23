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

const SortOptions = [
  { value: '-created', label: 'last created' },
  { value: '-updated', label: 'last modified' },
]

const NotesList = () => {
  const { wid } = useParams<{ wid: string }>()
  const workspaceId = +wid
  const [sortKey, setSortKey] = React.useState('-updated')

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isPending,
    isFetchingNextPage,
    status,
  } = useFetchAllNotes(workspaceId, sortKey)

  const allNotes = useMemo(() => {
    return data?.pages.map((page) => page.notes).flat()
  }, [data])

  console.log(allNotes)

  // save computed part of notes based on sort key
  // today, yesterday, earlier this week, last week, earlier this month, last month, older
  const todayNotes = useMemo(() => {
    return allNotes?.filter((note) => {
      const updated = dayjs.unix(note.updated)
      return updated.isSame(dayjs(), 'day')
    })
  }, [allNotes])

  const yesterdayNotes = useMemo(() => {
    return allNotes?.filter((note) => {
      const updated = dayjs.unix(note.updated)
      return updated.isSame(dayjs().subtract(1, 'day'), 'day')
    })
  }, [allNotes])

  const earlierThisWeekNotes = useMemo(() => {
    return allNotes?.filter((note) => {
      const updated = dayjs.unix(note.updated)
      // this week but not today or yesterday
      return (
        updated.isAfter(dayjs().startOf('week')) &&
        !updated.isSame(dayjs(), 'day') &&
        !updated.isSame(dayjs().subtract(1, 'day'), 'day')
      )
    })
  }, [allNotes])

  const lastWeekNotes = useMemo(() => {
    return allNotes?.filter((note) => {
      const updated = dayjs.unix(note.updated)
      return (
        updated.isAfter(dayjs().subtract(1, 'week').startOf('week')) &&
        updated.isBefore(dayjs().startOf('week'))
      )
    })
  }, [allNotes])

  const earlierThisMonthNotes = useMemo(() => {
    return allNotes?.filter((note) => {
      const updated = dayjs.unix(note.updated)
      return (
        updated.isAfter(dayjs().startOf('month')) &&
        !updated.isAfter(dayjs().startOf('week'))
      )
    })
  }, [allNotes])

  const lastMonthNotes = useMemo(() => {
    return allNotes?.filter((note) => {
      const updated = dayjs.unix(note.updated)
      return (
        updated.isAfter(dayjs().subtract(1, 'month').startOf('month')) &&
        updated.isBefore(dayjs().startOf('month'))
      )
    })
  }, [allNotes])

  const olderNotes = useMemo(() => {
    return allNotes?.filter((note) => {
      const updated = dayjs.unix(note.updated)
      return updated.isBefore(dayjs().subtract(1, 'month').startOf('month'))
    })
  }, [allNotes])

  if (status === 'pending') {
    return <div>Loading...</div>
  }

  if (status === 'error') {
    return <div>Error: {JSON.stringify(error)}</div>
  }

  return (
    <div>
      <div className='flex flex-row justify-between items-center'>
        <h2 className='text-xl text-zinc-300 font-medium'>all notes</h2>
        <Dropdown>
          <DropdownButton outline>
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
        <div>Loading...</div>
      ) : (
        <div>
          <NotesListSection
            title='today'
            notes={todayNotes}
            timeFormat='h:mm A'
          />
          <NotesListSection
            title='yesterday'
            notes={yesterdayNotes}
            timeFormat='ddd h:mm A'
          />
          <NotesListSection
            title='earlier this week'
            notes={earlierThisWeekNotes}
            timeFormat='ddd h:mm A'
          />
          <NotesListSection
            title='last week'
            notes={lastWeekNotes}
            timeFormat='MMM D h:mm A'
          />
          <NotesListSection
            title='earlier this month'
            notes={earlierThisMonthNotes}
            timeFormat='MMM D h:mm A'
          />
          <NotesListSection
            title='last month'
            notes={lastMonthNotes}
            timeFormat='MMM D h:mm A'
          />
          <NotesListSection title='older' notes={olderNotes} />
        </div>
      )}
    </div>
  )
}

export default NotesList
