import { Note } from '@/queries/services/note-service'
import { User } from '@/queries/services/auth-service'

export const defaultNewNote = (
  uuid: string,
  wid: number,
  text: string,
  user: User
): Note => {
  const nowInSeconds = Date.now() / 1000

  return {
    id: 0,
    uuid,
    workspaceId: wid,
    trashed: false,
    favorite: false,
    content: {
      dom: [
        {
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
        },
      ],
    },
    created: nowInSeconds,
    updated: nowInSeconds,
    createdBy: user,
    updatedBy: user,
  }
}
