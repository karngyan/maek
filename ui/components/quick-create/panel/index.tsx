'use client'

import { Block } from '@blocknote/core'
import { useMemo } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { useAuthInfo } from '@/queries/hooks/auth/use-auth-info'
import {
  QuickCreateOption,
  useQuickCreateOptions,
} from '@/queries/hooks/use-quick-create-options'

type QuickCreatePanelProps = {
  onQuickCreate: (
    dom: Block[],
    focusId?: string,
    focusPlacement?: 'end' | 'start'
  ) => unknown
}

const QuickCreatePanel = ({ onQuickCreate }: QuickCreatePanelProps) => {
  const { data: authInfo } = useAuthInfo()
  const { data: quickCreateOptions } = useQuickCreateOptions(
    authInfo?.user.name ?? ''
  )

  const [optionsOrder, setOptionsOrder] = useLocalStorage<string[]>(
    'quick-create-options-order',
    []
  )

  const options = useMemo(() => {
    if (quickCreateOptions == null) {
      return []
    }

    if (optionsOrder.length !== quickCreateOptions.length) {
      return quickCreateOptions
    }

    return optionsOrder.map((label) =>
      quickCreateOptions.find((o) => o.label === label)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quickCreateOptions])

  const onClick = (option: QuickCreateOption) => {
    if (quickCreateOptions == null) {
      return
    }

    const allOptions = quickCreateOptions.map((o) => o.label)
    const existingOrder = optionsOrder
      .filter((o) => allOptions.includes(o))
      .filter((o) => o !== option.label)
    const missingOptions = allOptions
      .filter((o) => !existingOrder.includes(o))
      .filter((o) => o !== option.label)

    setOptionsOrder([option.label, ...existingOrder, ...missingOptions])
    onQuickCreate(
      option.dom,
      option.focusOptions?.id,
      option.focusOptions?.placement
    )
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
      className='inline-flex shrink-0 text-xs justify-center items-center space-x-1.5 rounded-full bg-zinc-900 px-2.5 py-1 font-semibold text-zinc-500 shadow-xs ring-1 ring-inset ring-zinc-800 hover:shadow-sm hover:bg-zinc-950'
    >
      {icon}
      <span>{children}</span>
    </button>
  )
}

export default QuickCreatePanel
