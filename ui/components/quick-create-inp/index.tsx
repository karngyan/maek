'use client'

import React, { useState } from 'react'
import QuoteIcon from '@/components/ui/icons/quote'
import {
  Bars3CenterLeftIcon,
  BookOpenIcon,
  ListBulletIcon,
  NewspaperIcon,
  SunIcon,
  UsersIcon,
} from '@heroicons/react/16/solid'
import RecipeIcon from '@/components/ui/icons/recipe'

const QuickCreateInp = () => {
  const [value, setValue] = useState('')

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setValue(e.currentTarget.value)
  }

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
          defaultValue={value}
          onInput={handleInput}
        />

        {/* Spacer element to match the height of the toolbar */}
        <div aria-hidden='true' className='py-2'>
          {/* Matches height of button in toolbar (1px border + 36px content height) */}
          <div className='py-px'>
            <div className='h-9' />
          </div>
        </div>
      </div>

      <div className='absolute inset-x-0 bottom-0 overflow-scroll flex items-center space-x-2 py-2 pl-3 pr-2'>
        <span className='text-sm text-zinc-500 shrink-0'>quick create:</span>
        <QuickButton icon={<QuoteIcon className='h-3 text-zinc-500' />}>
          quote
        </QuickButton>
        <QuickButton icon={<SunIcon className='h-4 text-zinc-500' />}>
          daily planner
        </QuickButton>
        <QuickButton
          icon={<Bars3CenterLeftIcon className='h-4 text-zinc-500' />}
        >
          meeting notes
        </QuickButton>
        <QuickButton icon={<UsersIcon className='h-4 text-zinc-500' />}>
          1:1 notes
        </QuickButton>
        <QuickButton icon={<NewspaperIcon className='h-4 text-zinc-500' />}>
          project plan
        </QuickButton>
        <QuickButton icon={<RecipeIcon className='h-3 text-zinc-500' />}>
          recipe
        </QuickButton>
        <QuickButton icon={<BookOpenIcon className='h-4 text-zinc-500' />}>
          book recommendation
        </QuickButton>
      </div>
    </div>
  )
}

const QuickButton = ({
  icon,
  children,
}: React.PropsWithChildren<{ icon: React.ReactNode }>) => {
  return (
    <button
      type='button'
      className='inline-flex shrink-0 text-xs justify-center items-center space-x-1.5 rounded-full bg-zinc-900 px-2.5 py-1 font-semibold text-zinc-500 shadow-sm ring-1 ring-inset ring-zinc-800 hover:shadow hover:bg-zinc-950'
    >
      {icon}
      <span>{children}</span>
    </button>
  )
}

export default QuickCreateInp
