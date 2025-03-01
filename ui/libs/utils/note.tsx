import { Note } from '@/queries/services/note'
import { User } from '@/queries/services/auth'
import { type Block } from '@blocknote/core'

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
    createdById: user.id,
    updatedById: user.id,
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
    isNew: true, // client side only
    mdContent: '',
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
export const getNoteTitle = (dom: Block[]) => {
  let title = ''

  forEachBlock(dom, (block) => {
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

export const collabDocID = (uuid: string, wid: number) => {
  return `${wid}-${uuid}`
}