'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@/libs/utils'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs text-zinc-300',
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName


const SimpleTooltipContent = ({
  label,
  side = 'bottom',
}: {
  label: string
  side?: 'bottom' | 'left' | 'right' | 'top'
}) => (
  <TooltipContent side={side}>
    <div className='bg-zinc-900 border border-zinc-800 shadow-zinc-900 rounded-sm px-2 py-1'>
      <p className='text-xs text-zinc-400'>{label}</p>
    </div>
  </TooltipContent>
)

interface ConditionalTooltipProps {
  children: React.ReactNode
  label: string
  side?: 'bottom' | 'left' | 'right' | 'top'
  disabled?: boolean
  asChild?: boolean
}

const ConditionalTooltip: React.FC<ConditionalTooltipProps> = ({
  children,
  asChild = false,
  label,
  side = 'bottom',
  disabled = false,
}) => {
  if (disabled) {
    return <>{children}</>
  }

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <SimpleTooltipContent label={label} side={side} />
    </Tooltip>
  )
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  SimpleTooltipContent,
  ConditionalTooltip,
}
