package collections

import (
	"context"

	"github.com/bluele/go-timecop"
	"github.com/karngyan/maek/db"
)

func CreateCollection(ctx context.Context, wid int64, userID int64, name string) (*Collection, error) {
	now := timecop.Now().Unix()

	collection := &Collection{
		Name:        name,
		Created:     now,
		Updated:     now,
		WorkspaceID: wid,
		CreatedByID: userID,
		UpdatedByID: userID,
	}

	var err error
	collection.ID, err = db.Q.InsertCollection(ctx, db.InsertCollectionParams{
		Name:        collection.Name,
		Created:     collection.Created,
		Updated:     collection.Updated,
		WorkspaceID: collection.WorkspaceID,
		CreatedByID: collection.CreatedByID,
		UpdatedByID: collection.UpdatedByID,
	})
	if err != nil {
		return nil, err
	}

	return collection, nil
}
