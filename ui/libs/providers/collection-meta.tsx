'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type CollectionMeta = {
  isSelected: boolean
}

// id -> CollectionMeta
type Store = Record<number, CollectionMeta>

type CollectionMetaContextType = {
  collectionMeta: Store
  setCollectionMeta: React.Dispatch<React.SetStateAction<Store>>
}

const CollectionMetaContext = createContext<
  CollectionMetaContextType | undefined
>(undefined)

const CollectionMetaProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [collectionMeta, setCollectionMeta] = useState<Store>({})

  return (
    <CollectionMetaContext.Provider
      value={{ collectionMeta, setCollectionMeta }}
    >
      {children}
    </CollectionMetaContext.Provider>
  )
}

const useCollectionMeta = () => {
  const context = useContext(CollectionMetaContext)
  if (context === undefined) {
    throw new Error(
      'useCollectionMeta must be used within a CollectionMetaProvider'
    )
  }
  return context
}

export { CollectionMetaProvider, useCollectionMeta }
