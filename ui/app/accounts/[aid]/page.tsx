'use client'

import { Button } from '@/components/ui/button'
import { useLogout } from '@/queries/hooks/use-logout'

export default function AccountsHomePage() {
  const { mutate: logout } = useLogout()

  const handleLogout = () => {
    logout()
  }
  return <Button onClick={handleLogout}>Logout</Button>
}
