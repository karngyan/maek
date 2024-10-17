'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type NoteStore, createNoteStore } from '@/stores/note'

export type NoteStoreApi = ReturnType<typeof createNoteStore>

export const NoteStoreContext = createContext<NoteStoreApi | undefined>(
  undefined
)

export interface NoteStoreProviderProps {
  children: ReactNode
}

export const NoteStoreProvider = ({ children }: NoteStoreProviderProps) => {
  const storeRef = useRef<NoteStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createNoteStore()
  }

  return (
    <NoteStoreContext.Provider value={storeRef.current}>
      {children}
    </NoteStoreContext.Provider>
  )
}

export const useNoteStore = <T,>(selector: (store: NoteStore) => T): T => {
  const counterStoreContext = useContext(NoteStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useNoteStore must be used within NoteStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}
