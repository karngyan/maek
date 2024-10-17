import { createStore } from 'zustand/vanilla'
import { Note } from '@/queries/services/note-service'

export type NoteState = {
  notes: Record<string, Partial<Note>>
}

export type NoteStateActions = {
  updateContent: (uuid: string, content: Record<string, unknown>) => unknown
  addNote: (note: Partial<Note>) => unknown
}

export type NoteStore = NoteState & NoteStateActions

export const defaultInitState: NoteState = {
  notes: {},
}

export const createNoteStore = (initState: NoteState = defaultInitState) => {
  return createStore<NoteStore>()((set) => ({
    ...initState,
    updateContent: (uuid, content) => {
      set((state) => {
        state.notes[uuid] = {
          ...state.notes[uuid],
          ...content,
        }
        return state
      })
    },
    addNote: (note) => {
      set((state) => {
        if (!note.uuid) {
          throw new Error('Note uuid is required')
        }

        state.notes[note.uuid] = note
        return state
      })
    },
  }))
}
