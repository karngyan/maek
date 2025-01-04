package notes

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/ui_api/models"
	"github.com/karngyan/maek/ui_api/web"
)

func list(ctx web.Context) error {
	var (
		cursor string
		limit  string
		sort   string
	)

	echo.QueryParamsBinder(ctx).
		String("cursor", &cursor).
		String("limit", &limit).
		String("sort", &sort)

	rctx := ctx.Request().Context()

	var l int
	var err error
	l, err = strconv.Atoi(limit)
	if err != nil {
		l = notes.DefaultLimit
	}

	sk := notes.FromSortString(sort)
	bundle, err := notes.FindNotesForWorkspace(rctx, ctx.WorkspaceID, cursor, l, sk)
	if err != nil {
		if errors.Is(err, notes.ErrLimitTooHigh) {
			return ctx.JSON(http.StatusBadRequest, map[string]any{
				"limit": "limit is too high",
			})
		}

		return ctx.InternalError(err)
	}

	uiNotes := make([]*models.Note, 0, len(bundle.Notes))
	for _, n := range bundle.Notes {
		mn, err := models.ModelForNote(n)
		if err != nil {
			return ctx.InternalError(err)
		}

		uiNotes = append(uiNotes, mn)
	}

	return ctx.JSON(http.StatusOK, map[string]any{
		"notes":      uiNotes,
		"nextCursor": bundle.NextCursor,
	})
}
