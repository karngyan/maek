import type { Metadata } from 'next'
import './globals.css'
import type React from 'react'
import { QueryProvider } from '@/libs/providers/query'
import { NoteStoreProvider } from '@/libs/providers/note-store'
import { monaSansGithub } from '@/fonts'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title:
    'maek.ai - note taking for the minimalist developer, entrepreneur, and creator',
  description:
    'maek.ai is an open source note taking app for the minimalist. it is a simple, fast, and secure note taking app that is designed to help you focus on what matters most.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' className='dark bg-zinc-950'>
      <body className={`${monaSansGithub.className} antialiased`}>
        <QueryProvider>
          <NoteStoreProvider>{children}</NoteStoreProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
