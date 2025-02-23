package notes

import (
	"context"

	mapset "github.com/deckarep/golang-set/v2"
	"github.com/karngyan/maek/db"
)

func AddCollectionsToNote(ctx context.Context, wid int64, nuuid string, cids []int64) error {
	n, err := FindNoteByUUID(ctx, nuuid, wid)
	if err != nil {
		return err
	}

	return db.Tx(ctx, func(ctx context.Context, q *db.Queries) error {
		dbCollections, err := q.GetCollectionsByNoteUUIDAndWorkspace(ctx, db.GetCollectionsByNoteUUIDAndWorkspaceParams{
			UUID:        nuuid,
			WorkspaceID: wid,
		})
		if err != nil {
			return err
		}

		collectionSet := mapset.NewSet[int64](cids...)
		for _, dbCollection := range dbCollections {
			collectionSet.Add(dbCollection.ID)
		}

		nids := make([]int64, 0, collectionSet.Cardinality())
		for i := 0; i < collectionSet.Cardinality(); i++ {
			nids = append(nids, n.ID)
		}

		return q.AddNotesToCollections(ctx, db.AddNotesToCollectionsParams{
			CollectionIds: collectionSet.ToSlice(),
			NoteIds:       nids,
		})
	})
}
