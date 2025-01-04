export const keys = {
  allNotes: () => ['notes'],
  note: (workspaceId: number, noteUuid: string) => [
    ...keys.allNotes(),
    { wid: workspaceId, uuid: noteUuid },
  ],
  notesByWorkspace: (workspaceId: number) => [
    ...keys.allNotes(),
    { wid: workspaceId },
  ],
}
