'use client'

import * as Headless from '@headlessui/react'
import React, { useMemo, useState } from 'react'
import { NavbarItem } from '@/components/ui/navbar'
import { Button } from '../ui/button'
import {
  ArrowRightStartOnRectangleIcon,
  ChatBubbleBottomCenterTextIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/16/solid'
import { useLocalStorage } from 'usehooks-ts'
import { Resizable } from 're-resizable'
import { cn } from '@/libs/utils'

function OpenMenuIcon() {
  return (
    <svg data-slot='icon' viewBox='0 0 20 20' aria-hidden='true'>
      <path d='M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z' />
    </svg>
  )
}

function CloseMenuIcon() {
  return (
    <svg data-slot='icon' viewBox='0 0 20 20' aria-hidden='true'>
      <path d='M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z' />
    </svg>
  )
}

function MobileSidebar({
  open,
  close,
  children,
}: React.PropsWithChildren<{ open: boolean; close: () => void }>) {
  return (
    <Headless.Dialog open={open} onClose={close} className='lg:hidden'>
      <Headless.DialogBackdrop
        transition
        className='fixed inset-0 bg-black/30 transition data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in'
      />
      <Headless.DialogPanel
        transition
        className='fixed inset-y-0 w-full max-w-80 p-2 transition duration-300 ease-in-out data-[closed]:-translate-x-full'
      >
        <div className='flex h-full flex-col rounded-lg bg-white shadow-sm ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10'>
          <div className='-mb-3 px-4 pt-3'>
            <Headless.CloseButton as={NavbarItem} aria-label='Close navigation'>
              <CloseMenuIcon />
            </Headless.CloseButton>
          </div>
          {children}
        </div>
      </Headless.DialogPanel>
    </Headless.Dialog>
  )
}

type RightSidebarState = 'chat' | 'copilot' | 'none'

export function SidebarLayout({
  navbar,
  sidebar,
  isSidebarOpen,
  children,
}: React.PropsWithChildren<{
  navbar: React.ReactNode
  sidebar: React.ReactNode
  isSidebarOpen: boolean
}>) {
  const [showSidebar, setShowSidebar] = useState(false)
  const [rightSidebarState, setRightSidebarState] =
    useLocalStorage<RightSidebarState>('maek:right-sidebar-state', 'none')
  const isAnyRightSidebarOpen = useMemo(
    () => rightSidebarState !== 'none',
    [rightSidebarState]
  )

  const [rightSidebarWidth, setRightSidebarWidth] = useLocalStorage<number>(
    'maek:right-sidebar-width',
    320
  )
  const [isResizingRightSidebar, setIsResizingRightSidebar] = useState(false)

  const onResizeStart = () => {
      setIsResizingRightSidebar(true)
  }

  const onResizeStop = (d: { width: number }) => {
      setRightSidebarWidth(rightSidebarWidth + d.width)
      setIsResizingRightSidebar(false)
  }

  return (
    <div className='relative isolate flex min-h-svh w-full bg-white max-lg:flex-col lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950'>
      {/* Sidebar on Desktop */}
      <div className={cn('fixed inset-y-0 left-0 max-lg:hidden overflow-hidden', isSidebarOpen ? 'w-64' : 'w-16')}>
        {sidebar}
      </div>

      {/* Sidebar on mobile */}
      <MobileSidebar open={showSidebar} close={() => setShowSidebar(false)}>
        {sidebar}
      </MobileSidebar>

      {/* Navbar on mobile */}
      <header className='flex items-center px-4 lg:hidden'>
        <div className='py-2.5'>
          <NavbarItem
            onClick={() => setShowSidebar(true)}
            aria-label='Open navigation'
          >
            <OpenMenuIcon />
          </NavbarItem>
        </div>
        <div className='min-w-0 flex-1'>{navbar}</div>
      </header>

      <main className={cn('transition-all duration-100 ease-in-out flex flex-1 max-h-svh flex-col pb-2 lg:min-w-0 lg:pr-2 lg:pt-2', isSidebarOpen ? 'lg:pl-64' : 'lg:pl-16')}>
        <div className='mb-2 flex flex-row justify-between items-center'>
          <div className='space-x-1.5'>
            <Button square plain>
              <MagnifyingGlassIcon className='h-4' />
            </Button>
            <Button square plain>
              <InboxIcon className='h-4' />
            </Button>
          </div>

          {!isAnyRightSidebarOpen && (
            <div className='space-x-1.5'>
              <Button
                square
                plain
                onClick={() => setRightSidebarState('copilot')}
              >
                <PaperAirplaneIcon className='h-4' />
              </Button>
              <Button square plain onClick={() => setRightSidebarState('chat')}>
                <ChatBubbleBottomCenterTextIcon className='h-4' />
              </Button>
            </div>
          )}
        </div>
        <div className='h-full overflow-scroll lg:rounded-lg lg:bg-white lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10'>
          {children}
        </div>
      </main>

      {isAnyRightSidebarOpen && (
        <Resizable
          size={{ width: rightSidebarWidth }}
          enable={{ left: true }}
          minWidth={250}
          maxWidth={700}
          onResizeStop={(e, direction, ref, d) => {
            onResizeStop(d)
          }}
          onResizeStart={onResizeStart}
          handleWrapperClass='group'
          handleComponent={{
            left: (
              <div
                className={cn(
                  'opacity-0 flex transition-opacity duration-100 ease-in-out group-hover:opacity-70 -ml-1 pt-14 pb-4 w-full h-full items-center justify-center',
                  isResizingRightSidebar && 'opacity-70'
                )}
              >
                <div className='border-l border-dashed border-primary-600 h-4'></div>
              </div>
            ),
          }}
          className='max-lg:hidden'
        >
          <aside className='flex flex-1 h-full max-h-svh flex-col pb-2 lg:min-w-0 lg:pr-2 lg:pt-2'>
            <div className='mb-2 flex flex-row justify-between items-center'>
              <div className='space-x-1.5'>
                <Button
                  square
                  plain
                  onClick={() => setRightSidebarState('copilot')}
                  data-checked={rightSidebarState === 'copilot'}
                >
                  <PaperAirplaneIcon className='h-4' />
                </Button>
                <Button
                  square
                  plain
                  onClick={() => setRightSidebarState('chat')}
                  data-checked={rightSidebarState === 'chat'}
                >
                  <ChatBubbleBottomCenterTextIcon className='h-4' />
                </Button>
              </div>
              <div>
                <Button
                  square
                  plain
                  onClick={() => setRightSidebarState('none')}
                >
                  <ArrowRightStartOnRectangleIcon className='h-4' />
                </Button>
              </div>
            </div>
            <div className='h-full overflow-scroll lg:rounded-lg lg:bg-white lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10'></div>
          </aside>
        </Resizable>
      )}
    </div>
  )
}
