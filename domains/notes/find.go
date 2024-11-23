package notes

import (
	"context"
	"encoding/base64"
	"errors"
	"strconv"

	"github.com/beego/beego/v2/client/orm"
	"github.com/karngyan/maek/db"
)

var ErrNoteNotFound = errors.New("note not found")
var ErrLimitTooHigh = errors.New("limit too high")

const (
	DefaultLimit = 100
)

type SortKey string

const (
	SortKeyCreatedAsc SortKey = "created"
	SortKeyUpdatedAsc SortKey = "updated"
	SortKeyCreatedDsc SortKey = "-created"
	SortKeyUpdatedDsc SortKey = "-updated"
)

func FromSortString(sort string) SortKey {
	switch sort {
	case "created":
		return SortKeyCreatedAsc
	case "updated":
		return SortKeyUpdatedAsc
	case "-created":
		return SortKeyCreatedDsc
	case "-updated":
		return SortKeyUpdatedDsc
	default:
		return SortKeyUpdatedDsc
	}
}

func decodeCursor(cursor string) (uint64, error) {
	csb, err := base64.StdEncoding.DecodeString(cursor)
	if err != nil {
		return 0, err
	}

	return strconv.ParseUint(string(csb), 10, 64)
}

func encodeCursor(id uint64) string {
	return base64.StdEncoding.EncodeToString([]byte(strconv.FormatUint(id, 10)))
}

func FindNotesForWorkspace(ctx context.Context, wsId uint64, cursor string, limit int, sortKey SortKey) ([]*Note, string, error) {
	if limit > DefaultLimit {
		return nil, "", ErrLimitTooHigh
	}

	if limit < 1 {
		limit = DefaultLimit
	}

	var notes []*Note

	lastNoteId, err := decodeCursor(cursor)
	if err != nil {
		lastNoteId = 0
	}

	if err := db.WithOrmerCtx(ctx, func(ctx context.Context, ormer orm.Ormer) error {
		conds := orm.NewCondition()
		conds = conds.And("deleted", false).And("has_content", true).And("workspace_id", wsId)
		if lastNoteId > 0 {

			filterKey := "id__gt"
			if sortKey == SortKeyCreatedDsc || sortKey == SortKeyUpdatedDsc {
				filterKey = "id__lt"
			}

			conds = conds.And(filterKey, lastNoteId)
		}

		_, err := ormer.QueryTable("note").OrderBy(string(sortKey)).SetCond(conds).Limit(limit).RelatedSel("CreatedBy", "UpdatedBy").All(&notes)
		if err != nil {
			return err
		}

		return nil
	}); err != nil {
		return nil, "", err
	}

	if len(notes) == 0 {
		return notes, "", nil
	}

	nextCursor := encodeCursor(notes[len(notes)-1].Id)
	return notes, nextCursor, nil
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
