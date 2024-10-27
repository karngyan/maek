import { Note } from '@/queries/services/note-service'
import { User } from '@/queries/services/auth-service'
import { type Block } from '@blocknote/core'
import QuoteIcon from '@/components/ui/icons/quote'
import { Bars3CenterLeftIcon, SunIcon } from '@heroicons/react/16/solid'
import dayjs from 'dayjs'
import TodoIcon from '@/components/ui/icons/todo'

export const defaultNewNote = (
  uuid: string,
  wid: number,
  text: string,
  user: User,
  dom?: Block[]
): Note => {
  const nowInSeconds = Math.floor(Date.now() / 1000)

  return {
    id: 0,
    uuid,
    workspaceId: wid,
    trashed: false,
    favorite: false,
    content: {
      dom: dom ?? [
        {
          id: '',
          type: 'paragraph',
          props: {
            textColor: 'default',
            backgroundColor: 'default',
            textAlignment: 'left',
          },
          content: [
            {
              type: 'text',
              text,
              styles: {},
            },
          ],
          children: [],
        },
      ],
    },
    created: nowInSeconds,
    updated: nowInSeconds,
    createdBy: user,
    updatedBy: user,
    hasAudios: false,
    hasClosedTasks: false,
    hasCode: false,
    hasContent: true,
    hasFiles: false,
    hasImages: false,
    hasLinks: false,
    hasOpenTasks: false,
    hasQuotes: false,
    hasTables: false,
    hasVideos: false,
  }
}

export const forEachBlock = (
  blocks: Block[],
  callback: (block: Block) => boolean
) => {
  function traverseBlockArray(blockArray: Block[]): boolean {
    for (const block of blockArray) {
      if (callback(block) === false) {
        return false
      }

      const children = block.children
      if (children && !traverseBlockArray(children)) {
        return false
      }
    }

    return true
  }

  traverseBlockArray(blocks)
}

// getHasMeta returns an object with boolean values for different types of data
// in the note content.
export const getHasMeta = (note: Note) => {
  const hasMeta = {
    hasContent: false,
    hasImages: false,
    hasVideos: false,
    hasOpenTasks: false,
    hasClosedTasks: false,
    hasCode: false,
    hasLinks: false,
    hasFiles: false,
    hasQuotes: false,
    hasTables: false,
    hasAudios: false,
  }

  if (!note.content || !note.content.dom) {
    return hasMeta
  }

  forEachBlock(note.content.dom, (block) => {
    const type = block.type
    switch (type) {
      case 'image':
        hasMeta.hasImages = true
        break
      case 'video':
        hasMeta.hasVideos = true
        break
      case 'paragraph':
      case 'heading':
      case 'bulletListItem':
      case 'numberedListItem':
      case 'checkListItem':
        const content = block.content
        if (Array.isArray(content)) {
          for (const inlineContent of content) {
            if (inlineContent.type === 'link') {
              hasMeta.hasLinks = true
              const linkContent = inlineContent.content
              if (Array.isArray(linkContent)) {
                for (const linkInlineContent of linkContent) {
                  if (hasMeta.hasContent) {
                    break
                  }

                  if (linkInlineContent.type === 'text') {
                    hasMeta.hasContent ||= linkInlineContent.text.length > 0
                  }
                }
              }
            } else if (inlineContent.type === 'text') {
              const text = inlineContent.text
              hasMeta.hasContent ||= text.length > 0
            }
          }
        }

        if (type === 'checkListItem') {
          const { checked } = block.props
          if (checked === true) {
            hasMeta.hasClosedTasks = true
          } else {
            hasMeta.hasOpenTasks = true
          }
        }
        break
      case 'audio':
        hasMeta.hasAudios = true
        break
      case 'file':
        hasMeta.hasFiles = true
        break
      case 'table':
        hasMeta.hasTables = true
        break
    }

    return true
  })

  hasMeta.hasContent = Object.values(hasMeta).some((value) => value)
  return hasMeta
}

// getNoteTitle returns the first text content of a note. It's an expensive
// operation, so it should be memoized and only called when necessary.
// Can also be used to make sure if the note has any content.
export const getNoteTitle = (note: Note) => {
  let title = ''

  forEachBlock(note.content.dom, (block) => {
    const type = block.type
    switch (type) {
      case 'paragraph':
      case 'heading':
      case 'bulletListItem':
      case 'numberedListItem':
      case 'checkListItem':
        const content = block.content
        if (Array.isArray(content)) {
          for (const inlineContent of content) {
            // either StyledText or Link
            if (inlineContent.type === 'text') {
              title = inlineContent.text
              return false
            } else if (inlineContent.type === 'link') {
              const linkContent = inlineContent.content
              if (Array.isArray(linkContent)) {
                for (const linkInlineContent of linkContent) {
                  if (linkInlineContent.type === 'text') {
                    title = linkInlineContent.text
                    return false
                  }
                }
              }
            }
          }
        }

        if (typeof content === 'string') {
          title = content
          return false
        }

        break
      case 'image':
      case 'video':
      case 'audio':
      case 'file':
        const { name, caption, url } = block.props
        title = name || caption || url
        if (title) {
          return false
        }
      case 'table':
        const tableContent = block.content
        if (
          tableContent &&
          tableContent.type === 'tableContent' &&
          Array.isArray(tableContent.rows)
        ) {
          const rows = tableContent.rows
          for (const row of rows) {
            for (const cell of row.cells) {
              if (typeof cell === 'string') {
                title = cell
                return false
              }
            }
          }
        }
        break
    }

    return true
  })

  return title
}

export type NoteMeta = {
  isSelected: boolean
}

export const QuickCreateOptions: {
  label: string
  icon: React.ReactNode
  dom: Block[]
  focusId?: string
  focusPlacement?: 'start' | 'end'
}[] = [
  {
    label: 'quote',
    icon: <QuoteIcon className='h-3 text-zinc-500' />,
    focusId: '04df564a-47c9-490c-ac8d-297d3556d4dd',
    focusPlacement: 'end',
    dom: [
      {
        children: [
          {
            children: [],
            content: [
              {
                styles: {},
                text: 'Add a quote',
                type: 'text',
              },
            ],
            id: '04df564a-47c9-490c-ac8d-297d3556d4dd',
            props: {
              backgroundColor: 'default',
              textAlignment: 'left',
              textColor: 'default',
            },
            type: 'paragraph',
          },
        ],
        content: [],
        id: 'ae92379d-c15a-473f-8042-745f8f20ff91',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [],
        id: '9dd202e0-7059-484e-b4de-2802e62c5b05',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'author: ',
            type: 'text',
          },
        ],
        id: '99a4002c-780d-49aa-9871-2fcfeafeed17',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'source: ',
            type: 'text',
          },
        ],
        id: '20cc9623-6e3b-4eb9-843e-62a0f3197582',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [],
        id: '397772ba-4fa0-485e-b980-0cce87c6478a',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
    ],
  },
  {
    label: 'daily planner',
    icon: <SunIcon className='h-4 text-zinc-500' />,
    focusId: 'b94d5453-cf0c-4d0b-95e3-1e767fc3c7dd',
    focusPlacement: 'end',
    dom: [
      {
        children: [],
        content: [
          {
            styles: {},
            text: `${dayjs().format('D MMMM YYYY')} Plan`,
            type: 'text',
          },
        ],
        id: '',
        props: {
          backgroundColor: 'default',
          level: 3,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'heading',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'My tasks',
            type: 'text',
          },
        ],
        id: '0f2d73e4-34a9-4825-b035-cdc2457fc348',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [],
        id: '124ce4ab-52aa-46cd-9f75-ef10820b28d1',
        props: {
          backgroundColor: 'default',
          checked: false,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'checkListItem',
      },
      {
        children: [],
        content: [],
        id: '419c5544-7ff9-466d-a185-7e0235917f22',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'Schedule',
            type: 'text',
          },
        ],
        id: 'a818aafa-e70d-4bb4-b423-63a5377a921f',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [],
        id: 'b94d5453-cf0c-4d0b-95e3-1e767fc3c7dd',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'bulletListItem',
      },
    ],
  },
  {
    label: 'meeting notes',
    icon: <Bars3CenterLeftIcon className='h-4 text-zinc-500' />,
    focusId: 'c54616f5-7b49-44ae-9051-908cf34ffc70',
    focusPlacement: 'start',
    dom: [
      {
        children: [],
        content: [
          {
            styles: {},
            text: ` - ${dayjs().format('D MMMM YYYY')}`,
            type: 'text',
          },
        ],
        id: 'c54616f5-7b49-44ae-9051-908cf34ffc70',
        props: {
          backgroundColor: 'default',
          level: 2,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'heading',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'Attendees: ',
            type: 'text',
          },
        ],
        id: '0ed01ac4-87a8-4a65-9dec-9456545faf84',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [],
        id: '99e1618e-699a-400a-b0e6-4e0c4d8a53b5',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'Next Steps',
            type: 'text',
          },
        ],
        id: '74ad8a46-e5aa-4f88-bc69-23dbc31def27',
        props: {
          backgroundColor: 'default',
          level: 3,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'heading',
      },
      {
        children: [],
        content: [],
        id: '9f0cfa83-8d4e-41b2-afc6-c50ec86d7b6c',
        props: {
          backgroundColor: 'default',
          checked: false,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'checkListItem',
      },
      {
        children: [],
        content: [],
        id: 'c98ba6ea-d368-4bba-a922-887ddf1029a9',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'Agenda',
            type: 'text',
          },
        ],
        id: '374f6ce1-446b-4725-8cbd-71589dbcdde0',
        props: {
          backgroundColor: 'default',
          level: 3,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'heading',
      },
      {
        children: [],
        content: [],
        id: 'de2182c9-1262-4c56-ab99-311805ac9569',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'bulletListItem',
      },
    ],
  },
  {
    label: 'to-do list',
    icon: <TodoIcon className='h-3 text-zinc-500' />,
    focusId: '8320befb-c3a4-4164-b0b3-b7732b0f2ff1',
    focusPlacement: 'end',
    dom: [
      {
        children: [],
        content: [
          {
            styles: {},
            text: `My Tasks - ${dayjs().format('D MMMM YYYY')}`,
            type: 'text',
          },
        ],
        id: '0f14e78c-7e45-4de8-ba79-42309a4244de',
        props: {
          backgroundColor: 'default',
          level: 3,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'heading',
      },
      {
        children: [],
        content: [],
        id: '8320befb-c3a4-4164-b0b3-b7732b0f2ff1',
        props: {
          backgroundColor: 'default',
          checked: false,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'checkListItem',
      },
    ],
  },
]

export const isDomEmpty = (dom: Block[]) => {
  if (dom.length > 1) {
    return false
  }

  if (dom.length === 0) {
    return true
  }

  const block = dom[0]
  if (block.type !== 'paragraph') {
    return false
  }

  if (block.children.length > 0) {
    return false
  }

  const content = block.content
  if (typeof content === 'string') {
    return content === ''
  }

  if (Array.isArray(content)) {
    // StyledText[] or Link[]
    if (content.length === 0) {
      return true
    }

    if (content.length > 1) {
      return false
    }

    const inlineContent = content[0]
    if (inlineContent.type === 'link') {
      return false // if you have a link you got some content
    }

    return inlineContent.text === ''
  }

  return false
}
