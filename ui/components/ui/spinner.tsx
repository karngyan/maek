import styles from './styles.module.css'
import { cn } from '@/libs/utils'

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('dark:text-zinc-950 text-zinc-500', className)}
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      fill='currentColor'
    >
      <path
        d='M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z'
        className={styles.spinner}
      />
    </svg>
  )
}
