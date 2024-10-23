import React, { createContext, useContext, useState, ReactNode } from 'react'

type NoteMeta = {
  isSelected: boolean
}

// uuid -> NoteMeta
type Store = Record<string, NoteMeta>

type NoteMetaContextType = {
  noteMeta: Store
  setNoteMeta: React.Dispatch<React.SetStateAction<Store>>
}

const NoteMetaContext = createContext<NoteMetaContextType | undefined>(
  undefined
)

const NoteMetaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [noteMeta, setNoteMeta] = useState<Store>({})

  return (
    <NoteMetaContext.Provider value={{ noteMeta, setNoteMeta }}>
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
