'use client'

import * as Headless from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { forwardRef, Fragment, useState } from 'react'
import clsx from 'clsx'

interface ComboboxProps<T extends object> {
  label?: string
  items: T[]
  idForItem: (item: T) => string | number
  displayValue: (item: T) => string
  onChange: (item: T | null) => void
  placeholder?: string
  className?: string
  defaultValue?: T | null
  renderItem?: (props: {
    item: T
    focus: boolean
    selected: boolean
  }) => React.ReactElement
}

function ComboboxComponent<T extends object>(
  {
    label,
    items,
    idForItem,
    displayValue,
    onChange,
    placeholder,
    className,
    defaultValue = null,
    renderItem,
    ...props
  }: ComboboxProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const [query, setQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<T | null>(defaultValue)

  const filteredItems = query === '' 
    ? items 
    : items.filter((item) => 
        displayValue(item)
          .toLowerCase()
          .includes(query.toLowerCase())
      )

  const getDisplayValue = (item: T | null) => {
    if (!item) return ''
    return displayValue(item)
  }

  return (
    <Headless.Combobox
      as="div"
      ref={ref}
      value={selectedItem}
      onChange={(item: T | null) => {
        setQuery('')
        setSelectedItem(item)
        onChange(item)
      }}
      className={clsx('relative w-full', className)}
      {...props}
    >
      {label && (
        <Headless.Label className="block text-sm font-medium text-zinc-300">
          {label}
        </Headless.Label>
      )}
      <div className="relative mt-2">
        <Headless.ComboboxInput
          className="block w-full rounded-md bg-zinc-900 py-1.5 pl-3 pr-12 text-base text-zinc-200 outline-none border-zinc-700 placeholder:text-zinc-500 focus:border-primary-600 sm:text-sm/6 focus:ring-0 focus:outline-0"
          placeholder={placeholder}
          onBlur={() => setQuery('')}
          onChange={(e) => setQuery(e.target.value)}
          displayValue={getDisplayValue}
        />
        <Headless.ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-zinc-600" aria-hidden="true" />
        </Headless.ComboboxButton>

        {filteredItems.length > 0 && (
          <Headless.ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-zinc-900 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {filteredItems.map((item) => (
              <Headless.ComboboxOption
                as={Fragment}
                key={idForItem(item)}
                value={item}
              >
                {({ focus, selected }) => 
                  renderItem ? (
                    renderItem({ item, focus, selected })
                  ) : (
                    <div
                      className={clsx(
                        'group relative cursor-default select-none py-2 pl-3 pr-9 text-zinc-300',
                        focus && 'bg-primary-700 text-zinc-200 outline-none'
                      )}
                    >
                      <div className="flex items-center">
                        <span className="ml-3 truncate group-data-[selected]:font-semibold">
                          {displayValue(item)}
                        </span>
                      </div>
                      <span
                        className={clsx(
                          'absolute inset-y-0 right-0 items-center pr-4 text-primary-600',
                          focus ? 'text-white' : '',
                          selected ? 'flex' : 'hidden',
                          !selected && 'hidden'
                        )}
                      >
                        <CheckIcon className="size-5" aria-hidden="true" />
                      </span>
                    </div>
                  )
                }
              </Headless.ComboboxOption>
            ))}
          </Headless.ComboboxOptions>
        )}
      </div>
    </Headless.Combobox>
  )
}

export const Combobox = forwardRef(ComboboxComponent) as <T extends object>(
  props: ComboboxProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement