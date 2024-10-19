'use client'

import LogoMaek from '@/components/logo/maek'
import {
  ErrorMessage,
  Field,
  FieldGroup,
  Fieldset,
  Label,
} from '@/components/ui/fieldset'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import * as Headless from '@headlessui/react'
import { FormEvent, useMemo, useState } from 'react'
import { Link } from '@/components/ui/link'
import { useLogin } from '@/queries/hooks/use-login'
import { useRouter } from 'next/navigation'
import axios from 'axios'

type ApiError = {
  email?: string
  password?: string
}

export default function LoginForm() {
  const router = useRouter()
  const { mutate: login, isPending, error } = useLogin()
  const [{ email, password, remember }, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    login(
      { email, password, remember },
      {
        onSuccess: (data) => {
          router.replace(`/workspaces/${data.user.defaultWorkspaceId}`)
        },
      }
    )
  }

  const disabled = useMemo(() => {
    return (
      !email ||
      !password ||
      password.length < 6 ||
      password.length > 64 ||
      isPending
    )
  }, [email, password, isPending])

  const errors = useMemo(() => {
    if (!axios.isAxiosError(error)) {
      return
    }

    if (!error.response) {
      return
    }

    return error.response.data as ApiError
  }, [error])

  return (
    <>
      <div className='flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <LogoMaek
            type={'square-transparent'}
            className='mx-auto h-10 w-auto'
          />
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form onSubmit={handleSubmit} className='space-y-8'>
            <Fieldset>
              <FieldGroup>
                <Field>
                  <Label>email</Label>
                  <Input
                    name='email'
                    type='email'
                    required={true}
                    autoComplete='email'
                    invalid={errors?.email != null}
                    value={email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                  <ErrorMessage
                    className={`transition-all duration-300 ease-in-out transform ${errors?.email ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    {errors?.email}
                  </ErrorMessage>
                </Field>
                <Field>
                  <Label>passwd</Label>
                  <Input
                    name='password'
                    type='password'
                    required={true}
                    autoComplete='current-password'
                    invalid={errors?.password != null}
                    value={password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  />
                  <ErrorMessage
                    className={`transition-all duration-300 ease-in-out transform ${errors?.password ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    {errors?.password}
                  </ErrorMessage>
                </Field>
              </FieldGroup>
            </Fieldset>

            <Headless.Field className='flex items-center gap-4'>
              <Switch
                checked={remember}
                onChange={(checked) => {
                  setFormData((prev) => ({
                    ...prev,
                    remember: checked,
                  }))
                }}
                color='cyan'
                name='remember_me'
              />
              <Label>remember me</Label>
            </Headless.Field>

            <Button
              loading={isPending}
              disabled={disabled}
              className='w-full'
              type='submit'
            >
              sign in
            </Button>
          </form>

          <p className='mt-10 text-center text-sm text-zinc-400'>
            not a member?{' '}
            <Link
              href='/register'
              className='font-semibold leading-6 text-cyan-400 hover:text-cyan-300'
            >
              create a new account
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
