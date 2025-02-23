package collections

import (
	"context"

	"github.com/karngyan/maek/db"
)

// RemoveNotesFromCollection removes notes from a collection
// idempotent operation
func RemoveNotesFromCollection(ctx context.Context, wid, cid int64, noteIDs []int64) error {
	return db.Q.RemoveNotesFromCollection(ctx, db.RemoveNotesFromCollectionParams{
		CollectionID: cid,
		NoteIds:      noteIDs,
	})
}
