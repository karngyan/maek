'use client'

import { Avatar } from '@/components/ui/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/ui/dropdown'
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer,
} from '@/components/ui/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from '@/components/ui/sidebar'
import { StackedLayout } from '@/components/ui/stacked-layout'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@heroicons/react/16/solid'
import { InboxIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import React, { useMemo } from 'react'
import Avvvatars from 'avvvatars-react'
import { useAuthInfo } from '@/queries/hooks/use-auth-info'
import { Spinner } from '@/components/ui/spinner'
import { Text } from '@/components/ui/text'

function TeamDropdownMenu() {
  return (
    <DropdownMenu className='min-w-80 lg:min-w-64' anchor='bottom start'>
      <DropdownItem href='/teams/1/settings'>
        <Cog8ToothIcon />
        <DropdownLabel>Settings</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href='/teams/1'>
        <Avatar slot='icon' src='/tailwind-logo.svg' />
        <DropdownLabel>Tailwind Labs</DropdownLabel>
      </DropdownItem>
      <DropdownItem href='/teams/2'>
        <Avatar
          slot='icon'
          initials='WC'
          className='bg-purple-500 text-white'
        />
        <DropdownLabel>Workcation</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href='/teams/create'>
        <PlusIcon />
        <DropdownLabel>New team&hellip;</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  )
}

export default function AccountsHomeLayout({
  params,
  children,
}: {
  params: { accountId: string }
  children: React.ReactNode
}) {
  let { accountId } = params
  accountId = number(accountId)
  const navItems = useMemo(
    () => [
      { label: 'home', href: `/accounts/${accountId}` },
      { label: 'collections', href: `/accounts/${accountId}/collections` },
      { label: 'favorites', href: `/accounts/${accountId}/favorites` },
      { label: 'chat', href: `/accounts/${accountId}/chat` },
    ],
    [accountId]
  )
  const { isPending, data, isError } = useAuthInfo()

  if (isPending) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Spinner className='dark:text-zinc-800 h-12' />
      </div>
    )
  }

  if (isError) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Text>Something went wrong, please reload the page.</Text>
      </div>
    )
  }

  const { accounts, user } = data
  const account = accounts.find((account) => account.id === accountId)

  if (account == null) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Text>Account not found.</Text>
      </div>
    )
  }

  return (
    <StackedLayout
      navbar={
        <Navbar>
          <Dropdown>
            <DropdownButton as={NavbarItem} className='max-lg:hidden'>
              <Avvvatars
                value={`${account.id}:${account.name}`}
                style='shape'
              />
              <NavbarLabel>Tailwind Labs</NavbarLabel>
              <ChevronDownIcon />
            </DropdownButton>
            <TeamDropdownMenu />
          </Dropdown>
          <NavbarDivider className='max-lg:hidden' />
          <NavbarSection className='max-lg:hidden'>
            {navItems.map(({ label, href }) => (
              <NavbarItem key={label} href={href}>
                {label}
              </NavbarItem>
            ))}
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem href='/search' aria-label='Search'>
              <MagnifyingGlassIcon />
            </NavbarItem>
            <NavbarItem href='/inbox' aria-label='Inbox'>
              <InboxIcon />
            </NavbarItem>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar src='/profile-photo.jpg' square />
              </DropdownButton>
              <DropdownMenu className='min-w-64' anchor='bottom end'>
                <DropdownItem href='/my-profile'>
                  <UserIcon />
                  <DropdownLabel>My profile</DropdownLabel>
                </DropdownItem>
                <DropdownItem href='/settings'>
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href='/privacy-policy'>
                  <ShieldCheckIcon />
                  <DropdownLabel>Privacy policy</DropdownLabel>
                </DropdownItem>
                <DropdownItem href='/share-feedback'>
                  <LightBulbIcon />
                  <DropdownLabel>Share feedback</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href='/logout'>
                  <ArrowRightStartOnRectangleIcon />
                  <DropdownLabel>Sign out</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem} className='lg:mb-2.5'>
                <Avatar src='/tailwind-logo.svg' />
                <SidebarLabel>Tailwind Labs</SidebarLabel>
                <ChevronDownIcon />
              </DropdownButton>
              <TeamDropdownMenu />
            </Dropdown>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              {navItems.map(({ label, href }) => (
                <SidebarItem key={label} href={href}>
                  {label}
                </SidebarItem>
              ))}
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      {children}
    </StackedLayout>
  )
}
