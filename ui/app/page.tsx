'use client'

import LogoMaek from '@/components/logo/maek'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import { IconLink } from '@/components/icon-link'
import React, { useId } from 'react'
import { StarField } from '@/components/star-field'

export default function Home() {
  return (
    <div className='h-screen flex flex-col justify-between'>
      <Glow />
      <header className='absolute inset-x-0 top-0 z-50'>
        <nav
          aria-label='Global'
          className='flex items-center justify-between p-6 lg:px-8'
        >
          <div className='flex lg:flex-1'>
            <Link href='/' className='-m-1.5 p-1.5'>
              <span className='sr-only'>maek.ai</span>
              <LogoMaek className='h-6 w-auto' type='full' />
            </Link>
          </div>
          <div className='flex flex-1 justify-end items-center space-x-4'>
            <Button href='/login'>Login</Button>
          </div>
        </nav>
      </header>
      <div className='relative isolate px-6'>
        <div className='mx-auto max-w-4xl py-32 md:py-64 md:mt-24'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold tracking-tight text-zinc-100 sm:text-6xl'>
              Effortless notes. Smarter{' '}
              <span className='text-cyan-500'>AI search</span> for instant
              insights.
            </h1>
            <p className='mt-6 text-lg leading-8 text-zinc-400'>
              Capture your ideas effortlessly and find them instantly with
              AI-driven search. Organize your notes, retrieve key information,
              and enhance your workflow with intelligent, minimalistic design.
              Elevate your productivity and focus on what matters.
            </p>
          </div>
          <div className='hidden lg:block'>
            <StarField />
          </div>
        </div>
      </div>
      <footer className='p-6 lg: px-8'>
        <div className='flex items-center justify-between'>
          <FooterKarn />
          <FooterGithub />
        </div>
      </footer>
    </div>
  )
}

function Glow() {
  const id = useId()

  return (
    <div className='absolute inset-0 -z-10 overflow-hidden bg-gray-950'>
      <svg
        className='rotate-0 absolute bottom-auto -right-40 left-auto top-[-40%] h-[180%] w-[80rem]'
        aria-hidden='true'
      >
        <defs>
          <radialGradient id={`${id}-desktop`} cx='100%'>
            <stop offset='0%' stopColor='rgba(56, 189, 248, 0.3)' />
            <stop offset='53.95%' stopColor='rgba(0, 71, 255, 0.09)' />
            <stop offset='100%' stopColor='rgba(10, 14, 23, 0)' />
          </radialGradient>
        </defs>
        <rect
          width='100%'
          height='100%'
          fill={`url(#${id}-desktop)`}
          className='block'
        />
      </svg>
      <div className='absolute inset-x-0 bottom-0 right-0 h-px bg-white mix-blend-overlay lg:left-auto lg:top-0 lg:h-auto lg:w-px' />
    </div>
  )
}

function GitHubIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox='0 0 16 16' aria-hidden='true' fill='currentColor' {...props}>
      <path d='M8 .198a8 8 0 0 0-8 8 7.999 7.999 0 0 0 5.47 7.59c.4.076.547-.172.547-.384 0-.19-.007-.694-.01-1.36-2.226.482-2.695-1.074-2.695-1.074-.364-.923-.89-1.17-.89-1.17-.725-.496.056-.486.056-.486.803.056 1.225.824 1.225.824.714 1.224 1.873.87 2.33.666.072-.518.278-.87.507-1.07-1.777-.2-3.644-.888-3.644-3.954 0-.873.31-1.586.823-2.146-.09-.202-.36-1.016.07-2.118 0 0 .67-.214 2.2.82a7.67 7.67 0 0 1 2-.27 7.67 7.67 0 0 1 2 .27c1.52-1.034 2.19-.82 2.19-.82.43 1.102.16 1.916.08 2.118.51.56.82 1.273.82 2.146 0 3.074-1.87 3.75-3.65 3.947.28.24.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.14.46.55.38A7.972 7.972 0 0 0 16 8.199a8 8 0 0 0-8-8Z' />
    </svg>
  )
}

function XIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox='0 0 16 16' aria-hidden='true' fill='currentColor' {...props}>
      <path d='M9.51762 6.77491L15.3459 0H13.9648L8.90409 5.88256L4.86212 0H0.200195L6.31244 8.89547L0.200195 16H1.58139L6.92562 9.78782L11.1942 16H15.8562L9.51728 6.77491H9.51762ZM7.62588 8.97384L7.00658 8.08805L2.07905 1.03974H4.20049L8.17706 6.72795L8.79636 7.61374L13.9654 15.0075H11.844L7.62588 8.97418V8.97384Z' />
    </svg>
  )
}

function FooterKarn() {
  return (
    <p className='flex items-baseline gap-x-2 text-[0.8125rem]/6 text-gray-500'>
      <span className='hidden md:block'>Brought to you by </span>
      <IconLink
        target='_blank'
        rel='noopener noreferrer'
        href='https://x.com/gyankarn'
        icon={XIcon}
        compact
      >
        karn
      </IconLink>
    </p>
  )
}

function FooterGithub() {
  return (
    <p className='flex items-baseline gap-x-2 text-[0.8125rem]/6 text-gray-500'>
      <IconLink
        target='_blank'
        rel='noopener noreferrer'
        href='https://github.com/karngyan/maek'
        icon={GitHubIcon}
        compact
      >
        maek
      </IconLink>
    </p>
  )
}
