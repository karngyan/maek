'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type NoteMeta = {
  isSelected: boolean
  id: number
}

// uuid -> NoteMeta
type Store = Record<string, NoteMeta>

type NoteMetaContextType = {
  noteMeta: Store
  setNoteMeta: React.Dispatch<React.SetStateAction<Store>>
  deselectAll: () => void
}

const NoteMetaContext = createContext<NoteMetaContextType | undefined>(
  undefined
)

const NoteMetaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [noteMeta, setNoteMeta] = useState<Store>({})

  const deselectAll = () => {
    const newNoteMeta = { ...noteMeta }
    for (const key in newNoteMeta) {
      newNoteMeta[key].isSelected = false
    }
    setNoteMeta(newNoteMeta)
  }

  return (
    <NoteMetaContext.Provider value={{ noteMeta, setNoteMeta, deselectAll }}>
      {children}
    </NoteMetaContext.Provider>
  )
}

const useNoteMeta = () => {
  const context = useContext(NoteMetaContext)
  if (context === undefined) {
    throw new Error('useNoteMeta must be used within a NoteMetaProvider')
  }
  return context
}

export { NoteMetaProvider, useNoteMeta }
