package collections

import (
	"context"

	mapset "github.com/deckarep/golang-set/v2"
	"github.com/karngyan/maek/db"
)

func AddNotesToCollection(ctx context.Context, wid, cid int64, noteIDs []int64) (*Collection, error) {
	c, err := FindCollectionByID(ctx, wid, cid)
	if err != nil {
		return nil, err
	}

	dbNotes, err := db.Q.GetNotesByCollectionID(ctx, db.GetNotesByCollectionIDParams{
		CollectionID: cid,
		WorkspaceID:  wid,
	})

	noteSet := mapset.NewSet[int64](noteIDs...)
	for _, dbNote := range dbNotes {
		noteSet.Add(dbNote.ID)
	}

	cids := make([]int64, 0, noteSet.Cardinality())
	for i := 0; i < noteSet.Cardinality(); i++ {
		cids = append(cids, cid)
	}

	err = db.Q.AddNotesToCollection(ctx, db.AddNotesToCollectionParams{
		CollectionIds: cids,
		NoteIds:       noteSet.ToSlice(),
	})
	if err != nil {
		return nil, err
	}

	return c, nil
}
