import { Link } from '@/components/ui/link'
import clsx from 'clsx'
import { Button } from '@/components/ui/button'

type NotFoundProps = {
  embed?: boolean
  statusCode?: number
}

export default function NotFound({ embed, statusCode }: NotFoundProps) {
  return (
    <>
      <main
        className={clsx(
          'grid place-items-center bg-zinc-900 px-6 py-24 sm:py-64 lg:px-8',
          embed ? 'min-h-full' : 'min-h-screen'
        )}
      >
        <div className='text-center'>
          <p className='text-base font-semibold text-cyan-600'>
            {statusCode ?? 404}
          </p>
          <h1 className='mt-4 text-3xl font-bold tracking-tight text-zinc-400 sm:text-5xl'>
            page not found
          </h1>
          <p className='mt-6 text-base leading-7 text-zinc-500'>
            sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className='mt-10 flex items-center justify-center gap-x-6'>
            <Button href='/workspaces'>go back home</Button>
          </div>
        </div>
      </main>
    </>
  )
}
