package notes

import (
	"context"

	"github.com/beego/beego/v2/client/orm"
	"github.com/karngyan/maek/db"
)

func FindNotesForWorkspace(ctx context.Context, wsId uint64) ([]*Note, error) {
	var notes []*Note
	if err := db.WithOrmerCtx(ctx, func(ctx context.Context, ormer orm.Ormer) error {
		_, err := ormer.QueryTable("note").Filter("deleted", false).Filter("workspace_id", wsId).RelatedSel("CreatedBy", "UpdatedBy").All(&notes)
		if err != nil {
			return err
		}

		return nil
	}); err != nil {
		return nil, err
	}

	return notes, nil
}

func FindNoteByUuid(ctx context.Context, nuuid string, workspaceId uint64) (*Note, error) {
	var note Note
	if err := db.WithOrmerCtx(ctx, func(ctx context.Context, ormer orm.Ormer) error {
		err := ormer.QueryTable("note").Filter("deleted", false).Filter("uuid", nuuid).Filter("workspace_id", workspaceId).RelatedSel("CreatedBy", "UpdatedBy").One(&note)
		if err != nil {
			return err
		}

		return nil
	}); err != nil {
		return nil, err
	}

	return &note, nil
}
