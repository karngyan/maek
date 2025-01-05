package collections

import (
	"context"

	"github.com/karngyan/maek/db"
)

// RemoveNotesToCollection removes notes from a collection
// idempotent operation
func RemoveNotesToCollection(ctx context.Context, wid, cid int64, noteIDs []int64) error {
	return db.Q.RemoveNotesFromCollection(ctx, db.RemoveNotesFromCollectionParams{
		CollectionID: cid,
		NoteIds:      noteIDs,
	})
}
