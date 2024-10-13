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
import { workspaceAvatarValue } from '@/libs/utils/auth'
import { Workspace } from '@/queries/services/auth-service'

function WorkspaceDropdownMenu({
  workspaces,
  currentWorkspaceId,
}: {
  workspaces: Workspace[]
  currentWorkspaceId: number
}) {
  return (
    <DropdownMenu className='min-w-80 lg:min-w-64' anchor='bottom start'>
      <DropdownItem href={`/workspaces/${currentWorkspaceId}/settings`}>
        <Cog8ToothIcon />
        <DropdownLabel>settings</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      {workspaces.map((workspace) => {
        return (
          <DropdownItem key={workspace.id} href={`/workspaces/${workspace.id}`}>
            <Avvvatars value={workspaceAvatarValue(workspace)} />
            <DropdownLabel>{workspace.name}</DropdownLabel>
          </DropdownItem>
        )
      })}
      <DropdownDivider />
      <DropdownItem href='/workspaces/create'>
        <PlusIcon />
        <DropdownLabel>New workspace&hellip;</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  )
}

export default function WorkspacesHomeLayout({
  params,
  children,
}: {
  params: { wid: string }
  children: React.ReactNode
}) {
  const workspaceId = +params.wid
  const navItems = useMemo(
    () => [
      { label: 'home', href: `/workspaces/${workspaceId}` },
      { label: 'collections', href: `/workspaces/${workspaceId}/collections` },
      { label: 'favorites', href: `/workspaces/${workspaceId}/favorites` },
      { label: 'chat', href: `/workspaces/${workspaceId}/chat` },
    ],
    [workspaceId]
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

  const { workspaces, user } = data
  const workspace = workspaces.find((workspace) => workspace.id === workspaceId)

  if (workspace == null) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Text>Workspace not found.</Text>
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
                size={20}
                value={workspaceAvatarValue(workspace)}
                style='shape'
              />
              <NavbarLabel>{workspace.name}</NavbarLabel>
              <ChevronDownIcon />
            </DropdownButton>
            <WorkspaceDropdownMenu
              workspaces={workspaces}
              currentWorkspaceId={workspaceId}
            />
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
              <WorkspaceDropdownMenu
                workspaces={workspaces}
                currentWorkspaceId={workspaceId}
              />
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
