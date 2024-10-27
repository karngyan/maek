'use client'

import {
  BookOpenIcon,
  NewspaperIcon,
  UsersIcon,
} from '@heroicons/react/16/solid'
import RecipeIcon from '@/components/ui/icons/recipe'
import { Block } from '@blocknote/core'
import { QuickCreateOptions } from '@/libs/utils/note'
import { useMemo } from 'react'
import { useLocalStorage } from 'usehooks-ts'

type QuickCreatePanelProps = {
  onQuickCreate: (
    dom: Block[],
    focusId?: string,
    focusPlacement?: 'end' | 'start'
  ) => unknown
}

const QuickCreatePanel = ({ onQuickCreate }: QuickCreatePanelProps) => {
  const [optionsOrder, setOptionsOrder] = useLocalStorage<string[]>(
    'quick-create-options-order',
    []
  )

  const options = useMemo(() => {
    if (optionsOrder.length !== QuickCreateOptions.length) {
      return QuickCreateOptions
    }

    return optionsOrder.map((label) =>
      QuickCreateOptions.find((o) => o.label === label)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onClick = (option: (typeof QuickCreateOptions)[0]) => {
    const allOptions = QuickCreateOptions.map((o) => o.label)
    const existingOrder = optionsOrder
      .filter((o) => allOptions.includes(o))
      .filter((o) => o !== option.label)
    const missingOptions = allOptions
      .filter((o) => !existingOrder.includes(o))
      .filter((o) => o !== option.label)

    setOptionsOrder([option.label, ...existingOrder, ...missingOptions])
    onQuickCreate(option.dom, option.focusId, option.focusPlacement)
  }

  if (options == null) {
    return null
  }

  return (
    <div className='animate-in slide-in-from-bottom no-scrollbar absolute inset-x-0 bottom-0 overflow-scroll flex items-center space-x-2 py-2 pl-3 pr-2'>
      <span className='text-sm text-zinc-500 shrink-0'>quick create:</span>
      {options.map((option) => {
        if (option == null) return null

        return (
          <QuickButton
            key={option.label}
            icon={option.icon}
            onClick={() => onClick(option)}
          >
            {option.label}
          </QuickButton>
        )
      })}
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
  )
}

const QuickButton = ({
  icon,
  children,
  onClick,
}: React.PropsWithChildren<{
  icon: React.ReactNode
  onClick?: () => unknown
}>) => {
  return (
    <button
      type='button'
      onClick={() => onClick?.()}
      className='inline-flex shrink-0 text-xs justify-center items-center space-x-1.5 rounded-full bg-zinc-900 px-2.5 py-1 font-semibold text-zinc-500 shadow-sm ring-1 ring-inset ring-zinc-800 hover:shadow hover:bg-zinc-950'
    >
      {icon}
      <span>{children}</span>
    </button>
  )
}

export default QuickCreatePanel
