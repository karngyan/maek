'use client'

import { Field, FieldGroup, Label } from '@/components/ui/fieldset'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useAuthInfo } from '@/queries/hooks/auth/use-auth-info'
import { useUpdateUser } from '@/queries/hooks/auth/use-update-user'
import { useDebounceCallback } from '@react-hook/debounce'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

export default function AccountSettingsPage() {
  const { isPending, isFetching, data: authInfoResponse, error } = useAuthInfo()
  const { mutate: updateUser } = useUpdateUser()

  const user = useMemo(() => {
    if (authInfoResponse) {
      return authInfoResponse.user
    }
    return null
  }, [authInfoResponse])

  const [userLocalName, setUserLocalName] = useState(user?.name)

  const debouncedUpdateName = useDebounceCallback((name: string) => {
    updateUser(
      { name: name.trim(), updateType: 'name' },
      {
        onSuccess: () => {
          toast.success('your name has been updated')
        },
      }
    )
  }, 600)

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setUserLocalName(name)
    debouncedUpdateName(name)
  }

  if (isPending || isFetching) {
    return (
      <div className='py-80 flex items-center justify-center'>
        <Spinner className='dark:text-zinc-800 h-12' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-zinc-300 py-80 px-6'>error: {error.message}</div>
    )
  }

  return (
    <div className='max-w-lg mx-auto py-16 px-4'>
      <FieldGroup>
        <Field>
          <Label>email</Label>
          <Input name='email' type='email' value={user?.email} disabled />
        </Field>
        <Field>
          <Label>full name</Label>
          <Input
            name='full_name'
            value={userLocalName}
            onChange={onNameChange}
          />
        </Field>
      </FieldGroup>
    </div>
  )
}
