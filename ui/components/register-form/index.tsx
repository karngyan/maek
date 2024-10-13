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
import { useRegister } from '@/queries/hooks/use-register'
import { useRouter } from 'next/navigation'
import axios from 'axios'

type ApiError = {
  email?: string
  password?: string
}

export default function RegisterForm() {
  const router = useRouter()
  const { mutate: register, isPending, error } = useRegister()
  const [{ name, email, password, accept }, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    accept: false,
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    register(
      { name, email, password },
      {
        onSuccess: (data) => {
          router.replace(`/accounts/${data.accounts[0].id}`)
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
      !accept ||
      isPending
    )
  }, [email, password, accept, isPending])

  const errors = useMemo(() => {
    if (!axios.isAxiosError(error)) {
      return
    }

    if (!error.response) {
      return
    }

    const apiError: ApiError = error.response?.data
    return apiError
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
                  <Label>name</Label>
                  <Input
                    name='name'
                    type='text'
                    required={false}
                    autoComplete='name'
                    value={name}
                    maxLength={200}
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
                    invalid={errors?.email != null}
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
                    maxLength={64}
                    autoComplete='current-password'
                    placeholder={'6-64 characters of whatever you want'}
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
              loading={isPending}
              disabled={disabled}
              className='w-full'
              type='submit'
            >
              create a new account
            </Button>
          </form>

          <p className='mt-6 text-center text-sm text-zinc-400'>
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
