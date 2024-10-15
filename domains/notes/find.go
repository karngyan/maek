package notes

import (
	"context"

	"github.com/beego/beego/v2/client/orm"
	"github.com/karngyan/maek/db"
)

func FetchNotesForWorkspace(ctx context.Context, wsId uint64) ([]*Note, error) {
	var notes []*Note
	if err := db.WithOrmerCtx(ctx, func(ctx context.Context, ormer orm.Ormer) error {
		_, err := ormer.QueryTable("note").Filter("workspace_id", wsId).RelatedSel("CreatedBy", "UpdatedBy").All(&notes)
		if err != nil {
			return err
		}

		return nil
	}); err != nil {
		return nil, err
	}

	return notes, nil
}
