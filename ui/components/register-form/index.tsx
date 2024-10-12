'use client'

import LogoMaek from '@/components/logo/maek'
import { Field, FieldGroup, Fieldset, Label } from '@/components/ui/fieldset'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import * as Headless from '@headlessui/react'
import { FormEvent, useMemo, useState } from 'react'
import { Link } from '@/components/ui/link'
import { useRegister } from '@/queries/hooks/use-register'

export default function RegisterForm() {
  const { mutate: register, isPending, isSuccess, isError } = useRegister()
  const [{ name, email, password, accept }, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    accept: false,
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    register({ name, email, password })
  }

  const disabled = useMemo(() => {
    return (
      !name ||
      !email ||
      !password ||
      password.length < 6 ||
      password.length > 64 ||
      !accept
    )
  }, [name, email, password, accept])

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
                  <Label>name</Label>
                  <Input
                    name='name'
                    type='text'
                    required={false}
                    autoComplete='name'
                    value={name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </Field>
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
                checked={accept}
                onChange={(checked) => {
                  setFormData((prev) => ({
                    ...prev,
                    accept: checked,
                  }))
                }}
                color='cyan'
                name='accept'
              />
              <Label>accept terms of service + privacy policy</Label>
            </Headless.Field>

            <Button
              loading={true}
              disabled={disabled}
              className='w-full'
              type='submit'
            >
              create a new account
            </Button>
          </form>

          <p className='mt-10 text-center text-sm text-zinc-400'>
            already have an account?{' '}
            <Link
              href='/login'
              className='font-semibold leading-6 text-cyan-400 hover:text-cyan-300'
            >
              login here
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
