package notes

import (
	"context"
	"errors"

	"github.com/beego/beego/v2/client/orm"
	"github.com/bluele/go-timecop"
	"github.com/karngyan/maek/db"
	"github.com/karngyan/maek/domains/auth"
)

func TrashNoteCtx(ctx context.Context, nuuid string, wid uint64, user *auth.User) error {
	// check if note already exists
	existingNote, err := FindNoteByUuid(ctx, nuuid, wid)
	if err != nil {
		if errors.Is(err, orm.ErrNoRows) {
			return ErrNoteNotFound
		}
		return err
	}

	return db.WithOrmerCtx(ctx, func(ctx context.Context, ormer orm.Ormer) error {
		existingNote.Trashed = true
		existingNote.Updated = timecop.Now().Unix()
		existingNote.UpdatedBy = user

		if _, err := ormer.Update(existingNote); err != nil {
			return err
		}

		return nil
	})
}

func TrashNoteMultiCtx(ctx context.Context, noteUuids []string, wid uint64, user *auth.User) error {
	return db.WithOrmerCtx(ctx, func(ctx context.Context, ormer orm.Ormer) error {
		for _, nuuid := range noteUuids {
			existingNote, err := FindNoteByUuid(ctx, nuuid, wid)
			if err != nil {
				if errors.Is(err, orm.ErrNoRows) {
					return ErrNoteNotFound
				}
				return err
			}

			existingNote.Trashed = true
			existingNote.Updated = timecop.Now().Unix()
			existingNote.UpdatedBy = user

			if _, err := ormer.Update(existingNote); err != nil {
				return err
			}
		}

		return nil
	})
}
