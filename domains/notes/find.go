package notes

import (
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"strconv"
	"strings"

	"github.com/beego/beego/v2/client/orm"
	"github.com/karngyan/maek/db"
)

var ErrNoteNotFound = errors.New("note not found")
var ErrLimitTooHigh = errors.New("limit too high")
var ErrInvalidCursor = errors.New("invalid cursor")
var ErrFailedToDecodeCursor = errors.New("failed to decode cursor")

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

func decodeCursor(cursor string) (int64, uint64, error) {
	if cursor == "" {
		return 0, 0, nil
	}

	decodedBytes, err := base64.StdEncoding.DecodeString(cursor)
	if err != nil {
		return 0, 0, ErrInvalidCursor
	}

	parts := strings.Split(string(decodedBytes), ":")
	if len(parts) != 2 {
		return 0, 0, ErrInvalidCursor
	}

	sortValue, err := strconv.ParseInt(parts[0], 10, 64)
	if err != nil {
		return 0, 0, ErrFailedToDecodeCursor
	}

	id, err := strconv.ParseUint(parts[1], 10, 64)
	if err != nil {
		return 0, 0, ErrFailedToDecodeCursor
	}

	return sortValue, id, nil
}

func encodeCursor(sortValue int64, id uint64) string {
	rawCursor := fmt.Sprintf("%d:%d", sortValue, id)
	return base64.StdEncoding.EncodeToString([]byte(rawCursor))
}

func FindNotesForWorkspace(ctx context.Context, wsId uint64, cursor string, limit int, sortKey SortKey) ([]*Note, string, error) {
	if limit > DefaultLimit {
		return nil, "", ErrLimitTooHigh
	}

	if limit < 1 {
		limit = DefaultLimit
	}

	var notes []*Note

	lastSortValue, lastNoteId, err := decodeCursor(cursor)
	if err != nil {
		lastNoteId = 0
		lastSortValue = 0
	}

	if err := db.WithOrmerCtx(ctx, func(ctx context.Context, ormer orm.Ormer) error {
		conds := orm.NewCondition()
		conds = conds.And("deleted", false).And("has_content", true).And("workspace_id", wsId)

		if lastSortValue > 0 {
			switch sortKey {
			case SortKeyCreatedAsc:
				conds = conds.And("created__gt", lastSortValue)
			case SortKeyCreatedDsc:
				conds = conds.And("created__lt", lastSortValue)
			case SortKeyUpdatedAsc:
				conds = conds.And("updated__gt", lastSortValue)
			case SortKeyUpdatedDsc:
				conds = conds.And("updated__lt", lastSortValue)
			default:
				return fmt.Errorf("unsupported sort key: %s", sortKey)
			}

			// Tie-break with ID for stability
			conds = conds.Or("created", lastSortValue).And("id__gt", lastNoteId)
		}

		// fetche one more than the limit to determine if there are more notes
		_, err := ormer.QueryTable("note").OrderBy(string(sortKey), "id").SetCond(conds).Limit(limit+1).RelatedSel("CreatedBy", "UpdatedBy").All(&notes)
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

	hasNextPage := len(notes) > limit
	if hasNextPage {
		notes = notes[:limit] // Trim to the requested limit
	}

	var nextCursor string
	if hasNextPage {
		lastNote := notes[len(notes)-1]
		nextCursor = encodeCursor(lastNote.SortValue(sortKey), lastNote.Id)
	}

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
