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
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from '@/components/ui/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarDivider,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/sidebar'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  DocumentTextIcon,
  HashtagIcon,
  LightBulbIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon,
  MagnifyingGlassIcon,
  InboxIcon,
} from '@heroicons/react/16/solid'
import React, { useMemo } from 'react'
import Avvvatars from 'avvvatars-react'
import { useAuthInfo } from '@/queries/hooks/auth/use-auth-info'
import { Spinner } from '@/components/ui/spinner'
import { Text } from '@/components/ui/text'
import { workspaceAvatarValue } from '@/libs/utils/auth'
import { Workspace } from '@/queries/services/auth'
import { Link } from '@/components/ui/link'
import { useLogout } from '@/queries/hooks/auth/use-logout'
import { usePathname, useRouter } from 'next/navigation'
import axios from 'axios'
import { SidebarLayout } from '@/components/sidebar/layout'
import LogoMaek from '@/components/logo/maek'
import { Button } from '@/components/ui/button'
import SidebarIcon from '@/components/ui/icons/sidebar'

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
          <DropdownItem
            key={workspace.id}
            href={`/workspaces/${workspace.id}`}
            className='flex-shrink-0'
          >
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
      {
        label: 'notes',
        href: `/workspaces/${workspaceId}/notes`,
        icon: <DocumentTextIcon />,
      },
      {
        label: 'collections',
        href: `/workspaces/${workspaceId}/collections`,
        icon: <HashtagIcon />,
      },
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
            replace={true}
            className='dark:text-primary-600 dark:hover:text-primary-500'
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

  const logoutUser = () => {
    logout(undefined, {
      onSuccess: () => {
        router.replace('/')
      },
    })
  }

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem href='/search' aria-label='Search'>
              <MagnifyingGlassIcon />
            </NavbarItem>
            <NavbarItem href='/inbox' aria-label='Inbox'>
              <InboxIcon />
            </NavbarItem>
            <Dropdown>
              <DropdownButton as={NavbarItem} className='flex-shrink-0'>
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
                <DropdownItem
                  href='https://x.com/intent/post?text=%40gyankarn+about+maek%3A'
                  target='_blank'
                  rel='noreferrer,noopener'
                >
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
            <div className='flex flex-row justify-between items-center'>
              <LogoMaek className='pl-2 h-6 w-auto' />
              <Button plain square>
                <SidebarIcon className='h-4' />
              </Button>
            </div>
            <SidebarDivider noMargin className='my-2' />
            <Dropdown>
              <DropdownButton as={SidebarItem} className='mb-2 flex-shrink-0'>
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
            <SidebarSection className='max-lg:hidden'>
              <SidebarItem href='/search'>
                <MagnifyingGlassIcon />
                <SidebarLabel>search</SidebarLabel>
              </SidebarItem>
              <SidebarItem href='/inbox'>
                <InboxIcon />
                <SidebarLabel>inbox</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              {navItems.map(({ label, href, icon }) => (
                <SidebarItem
                  current={pathname === href}
                  key={label}
                  href={href}
                >
                  {icon}
                  <SidebarLabel>{label}</SidebarLabel>
                </SidebarItem>
              ))}
            </SidebarSection>
            <SidebarSection className='max-lg:hidden'>
              <SidebarHeading>favorites</SidebarHeading>
              <SidebarItem href='/events/1'>
                Bear Hug: Live in Concert
              </SidebarItem>
              <SidebarItem href='/events/2'>Viking People</SidebarItem>
              <SidebarItem href='/events/3'>Six Fingers — DJ Set</SidebarItem>
              <SidebarItem href='/events/4'>We All Look The Same</SidebarItem>
            </SidebarSection>
            <SidebarSpacer />
            <SidebarSection>
              <SidebarItem href='/support'>
                <QuestionMarkCircleIcon />
                <SidebarLabel>support</SidebarLabel>
              </SidebarItem>
              <SidebarItem href='/changelog'>
                <SparklesIcon />
                <SidebarLabel>changelog</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
          <SidebarFooter className='max-lg:hidden'>
            <Dropdown>
              <DropdownButton
                as={SidebarItem}
              >
                <span className='w-10/12 flex flex-row items-center gap-3'>
                  <span className='flex-shrink-0'>
                    <Avvvatars
                      style='character'
                      size={30}
                      radius={5}
                      value={user.name.length > 0 ? user.name : user.email}
                    />
                  </span>
                  <span className='w-9/12 flex flex-col'>
                    <span className='truncate text-sm/5 font-medium text-zinc-950 dark:text-white'>
                      {user.name.length > 0 ? user.name : 'add your name'}
                    </span>
                    <span className='truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400'>
                      {user.email}
                    </span>
                  </span>
                </span>
                <span className='grow flex items-center justify-end flex-shrink-0'>
                  <ChevronUpIcon className='h-4' />
                </span>
              </DropdownButton>
              <DropdownMenu className='min-w-64' anchor='top start'>
                <DropdownItem href='/my-profile'>
                  <UserIcon />
                  <DropdownLabel>my profile</DropdownLabel>
                </DropdownItem>
                <DropdownItem href='/settings'>
                  <Cog8ToothIcon />
                  <DropdownLabel>settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href='/privacy-policy'>
                  <ShieldCheckIcon />
                  <DropdownLabel>privacy policy</DropdownLabel>
                </DropdownItem>
                <DropdownItem href='/share-feedback'>
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
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}
