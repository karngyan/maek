import { Note } from '@/queries/services/note-service'

export const defaultNote = (
  uuid: string,
  wid: number,
  text: string
): Partial<Note> => {
  return {
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
  }
}
