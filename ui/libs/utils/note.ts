import { Note } from '@/queries/services/note-service'
import { User } from '@/queries/services/auth-service'
import { Block } from '@blocknote/core'

export const defaultNewNote = (
  uuid: string,
  wid: number,
  text: string,
  user: User
): Note => {
  const nowInSeconds = Math.floor(Date.now() / 1000)

  return {
    id: 0,
    uuid,
    workspaceId: wid,
    trashed: false,
    favorite: false,
    content: {
      dom: [
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
