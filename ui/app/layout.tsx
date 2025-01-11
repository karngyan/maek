import type { Metadata } from 'next'
import './globals.css'
import type React from 'react'
import { QueryProvider } from '@/libs/providers/query'
import { monaSansGithub } from '@/fonts'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'

export const metadata: Metadata = {
  title: 'maek',
  description:
    'maek is an open source note taking app for the minimalist. it is a simple, fast, and secure note taking app that is designed to help you focus on what matters most.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' className='dark bg-zinc-950'>
      <body className={`${monaSansGithub.className} antialiased`}>
        <QueryProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
