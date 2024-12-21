package notes

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"

	"github.com/bluele/go-timecop"
	"github.com/karngyan/maek/db"
)

func TrashNote(ctx context.Context, nuuid string, wid int64, userID int64) error {
	_, err := db.Q.TrashNoteByUUID(ctx, db.TrashNoteByUUIDParams{
		Updated:     timecop.Now().Unix(),
		UpdatedByID: userID,
		UUID:        nuuid,
		WorkspaceID: wid,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNoteNotFound
		}
		return err
	}

	return nil
}

func TrashNoteMulti(ctx context.Context, noteUuids []string, wid int64, userID int64) error {
	return db.Q.TrashNotesByUUIDs(ctx, db.TrashNotesByUUIDsParams{
		Updated:     timecop.Now().Unix(),
		UpdatedByID: userID,
		Uuids:       noteUuids,
		WorkspaceID: wid,
	})
}
