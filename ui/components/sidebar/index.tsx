'use client'

import * as Headless from '@headlessui/react'
import { LayoutGroup, motion } from 'framer-motion'
import React, { Fragment, forwardRef, use, useId } from 'react'
import { TouchTarget } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import { cn } from '@/libs/utils'

export function Sidebar({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'nav'>) {
  const id = useId()
  return (
    <LayoutGroup id={id}>
      <nav
        {...props}
        className={cn(className, 'flex h-full min-h-0 flex-col')}
      />
    </LayoutGroup>
  )
}

export function SidebarHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <>
      <div
        {...props}
        className={cn(
          className,
          'flex flex-col px-4 py-2.5 [&>[data-slot=section]+[data-slot=section]]:mt-2.5'
        )}
      >
        {props.children}
      </div>
      <SidebarDivider />
    </>
  )
}

export function SidebarBody({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        className,
        'flex flex-1 flex-col overflow-y-auto p-4 [&>[data-slot=section]+[data-slot=section]]:mt-8'
      )}
    />
  )
}

export function SidebarFooter({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <>
      <SidebarDivider />
      <div
        {...props}
        className={cn(
          className,
          'flex flex-col p-2 [&>[data-slot=section]+[data-slot=section]]:mt-2.5'
        )}
      >
        {props.children}
      </div>
    </>
  )
}

export function SidebarSection({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      data-slot='section'
      className={cn(className, 'flex flex-col gap-0.5')}
    />
  )
}

export function SidebarDivider({
  className,
  noMargin,
  ...props
}: React.ComponentPropsWithoutRef<'hr'> & { noMargin?: boolean }) {
  return (
    <hr
      {...props}
      className={cn(
        className,
        'border-t border-zinc-950/5 border-dashed dark:border-white/5',
        !noMargin && 'mx-4'
      )}
    />
  )
}

export function SidebarSpacer({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      aria-hidden='true'
      {...props}
      className={cn(className, 'mt-8 flex-1')}
    />
  )
}

export function SidebarHeading({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'h3'>) {
  return (
    <h3
      {...props}
      className={cn(
        className,
        'mb-1 px-2 text-xs/6 font-medium text-zinc-500 dark:text-zinc-400'
      )}
    />
  )
}

export const SidebarItem = forwardRef(function SidebarItem(
  {
    current,
    className,
    children,
    ...props
  }: { current?: boolean; className?: string; children: React.ReactNode } & (
    | Omit<Headless.ButtonProps, 'as' | 'className'>
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>
  ),
  ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>
) {
  const classes = cn(
    // Base
    'flex w-full items-center gap-2 rounded-lg px-2 text-left text-sm font-medium text-zinc-950 py-1.5',
    // Leading icon/icon-only
    '*:data-[slot=icon]:size-4 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:fill-zinc-500',
    // Trailing icon (down chevron or similar)
    '*:last:data-[slot=icon]:ml-auto *:last:data-[slot=icon]:size-4',
    // Avatar
    '*:data-[slot=avatar]:-m-0.5 *:data-[slot=avatar]:size-7 *:data-[slot=avatar]:[--ring-opacity:10%] sm:*:data-[slot=avatar]:size-6',
    // Hover
    'data-hover:bg-zinc-950/5 data-hover:*:data-[slot=icon]:fill-zinc-950',
    // Active
    'data-active:bg-zinc-950/5 data-active:*:data-[slot=icon]:fill-zinc-950',
    // Current
    'data-current:bg-zinc-950/5 data-current:*:data-[slot=icon]:fill-zinc-950',
    // Dark mode
    'dark:text-white dark:*:data-[slot=icon]:fill-zinc-400',
    'dark:data-hover:bg-white/5 dark:data-hover:*:data-[slot=icon]:fill-zinc-200',
    'dark:data-active:bg-white/5 dark:data-active:*:data-[slot=icon]:fill-zinc-200',
    'dark:data-current:bg-white/5 dark:data-current:*:data-[slot=icon]:fill-zinc-200'
  )

  return (
    <span className={cn(className, 'relative')}>
      {current && (
        <motion.span
          layoutId='current-indicator'
          className='absolute inset-y-2 -left-4 w-0.5 rounded-full bg-zinc-950 dark:bg-white'
        />
      )}
      {'href' in props ? (
        <Headless.CloseButton as={Fragment} ref={ref}>
          <Link
            className={classes}
            {...props}
            data-current={current ? 'true' : undefined}
          >
            <TouchTarget>{children}</TouchTarget>
          </Link>
        </Headless.CloseButton>
      ) : (
        <Headless.Button
          {...props}
          className={cn('cursor-default', classes)}
          data-current={current ? 'true' : undefined}
          ref={ref}
        >
          <TouchTarget>{children}</TouchTarget>
        </Headless.Button>
      )}
    </span>
  )
})

export function SidebarLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) {
  return <span {...props} className={cn(className, 'truncate')} />
}
