'use client'

import LogoMaek from '@/components/logo/maek'
import { Field, FieldGroup, Fieldset, Label } from '@/components/ui/fieldset'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import * as Headless from '@headlessui/react'
import { FormEvent, useMemo, useState } from 'react'
import { Link } from '@/components/ui/link'

export default function LoginForm() {
  const [{ email, password, rememberMe }, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log({ email, password, rememberMe })
  }

  const disabled = useMemo(() => {
    return !email || !password || password.length < 6 || password.length > 64
  }, [email, password])

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
                    value={email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </Field>
                <Field>
                  <Label>passwd</Label>
                  <Input
                    name='password'
                    type='password'
                    required={true}
                    autoComplete='current-password'
                    value={password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  />
                </Field>
              </FieldGroup>
            </Fieldset>

            <Headless.Field className='flex items-center gap-4'>
              <Switch
                checked={rememberMe}
                onChange={(checked) => {
                  setFormData((prev) => ({
                    ...prev,
                    rememberMe: checked,
                  }))
                }}
                color='cyan'
                name='remember_me'
              />
              <Label>remember me</Label>
            </Headless.Field>

            <Button disabled={disabled} className='w-full' type='submit'>
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
