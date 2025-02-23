'use client'

import { Navbar, NavbarItem, NavbarSection } from '@/components/ui/navbar'
import { Text } from '@/components/ui/text'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export default function WorkspaceSettingsLayout({
  params,
  children,
}: {
  params: { wid: string }
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const navItems = useMemo(() => {
    return [
      {
        href: `/workspaces/${params.wid}/settings/account`,
        label: 'account',
      },
      {
        href: `/workspaces/${params.wid}/settings/ws`,
        label: 'workspace settings',
      },
    ]
  }, [params.wid])

  return (
    <div className=''>
      <Navbar className='border-b px-2 border-dashed border-zinc-800'>
        <NavbarSection>
          {navItems.map((item) => (
            <NavbarItem
              key={item.href}
              href={item.href}
              current={pathname === item.href}
            >
              <Text>{item.label}</Text>
            </NavbarItem>
          ))}
        </NavbarSection>
      </Navbar>
      <div>{children}</div>
    </div>
  )
}
