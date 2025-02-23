package notes

import (
	"context"

	"github.com/karngyan/maek/db"
)

func RemoveCollectionsFromNote(ctx context.Context, wid int64, nuuid string, cids []int64) error {
	n, err := FindNoteByUUID(ctx, nuuid, wid)
	if err != nil {
		return err
	}

	return db.Q.RemoveCollectionsFromNote(ctx, db.RemoveCollectionsFromNoteParams{
		NoteID:        n.ID,
		CollectionIds: cids,
	})
}
