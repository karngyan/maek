'use client'

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
import { Link } from '@/components/ui/link'
import { useLogout } from '@/queries/hooks/use-logout'
import { usePathname, useRouter } from 'next/navigation'
import axios from 'axios'

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
            <Avvvatars
              style='shape'
              size={16}
              value={workspaceAvatarValue(workspace)}
            />
            <DropdownLabel>{workspace.name}</DropdownLabel>
          </DropdownItem>
        )
      })}
      <DropdownDivider />
      <DropdownItem href='/create-workspace'>
        <PlusIcon />
        <DropdownLabel>new workspace&hellip;</DropdownLabel>
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
  const router = useRouter()
  const pathname = usePathname()
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
  const { isPending, data, error } = useAuthInfo()
  const { mutate: logout } = useLogout()

  if (isPending) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Spinner className='dark:text-zinc-800 h-12' />
      </div>
    )
  }

  if (axios.isAxiosError(error) && error?.response?.status === 401) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Text>
          You&#39;ve been logged out. Please{' '}
          <Link
            href='/login'
            className='dark:text-cyan-600 dark:hover:text-cyan-500'
          >
            login
          </Link>{' '}
          again.
        </Text>
      </div>
    )
  }

  if (data == null) {
    return
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

  const openFeedbackModal = () => {
    // TODO: Implement a feedback modal
  }

  const logoutUser = () => {
    logout(undefined, {
      onSuccess: () => {
        router.replace('/')
      },
    })
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
              <NavbarItem current={pathname === href} key={label} href={href}>
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
                <Avvvatars
                  style='character'
                  size={20}
                  value={user.name.length > 0 ? user.name : user.email}
                />
              </DropdownButton>
              <DropdownMenu className='min-w-64' anchor='bottom end'>
                <DropdownItem href='/profile'>
                  <UserIcon />
                  <DropdownLabel>my profile</DropdownLabel>
                </DropdownItem>
                <DropdownItem href='/settings'>
                  <Cog8ToothIcon />
                  <DropdownLabel>settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href='/privacy'>
                  <ShieldCheckIcon />
                  <DropdownLabel>privacy policy</DropdownLabel>
                </DropdownItem>
                <DropdownItem onClick={openFeedbackModal}>
                  <LightBulbIcon />
                  <DropdownLabel>share feedback</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem onClick={logoutUser}>
                  <ArrowRightStartOnRectangleIcon />
                  <DropdownLabel>sign out</DropdownLabel>
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
                <Avvvatars
                  size={20}
                  value={workspaceAvatarValue(workspace)}
                  style='shape'
                />
                <SidebarLabel>{workspace.name}</SidebarLabel>
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
                <SidebarItem
                  current={pathname === href}
                  key={label}
                  href={href}
                >
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
