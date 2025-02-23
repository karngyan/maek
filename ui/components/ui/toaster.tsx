"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {

  return (
    <Sonner
      theme='dark'
      visibleToasts={5}
      duration={5000}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:!bg-zinc-900 group-[.toaster]:!text-zinc-200 group-[.toaster]:!border-zinc-800 group-[.toaster]:!shadow-zinc-950",
          description: "group-[.toast]:!text-zinc-400",
          actionButton:
            "group-[.toast]:!bg-zinc-800 group-[.toast]:!text-zinc-300",
          cancelButton:
            "group-[.toast]:!bg-zinc-900 group-[.toast]:!text-zinc-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
