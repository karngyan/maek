package notes

import (
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/karngyan/maek/routers/models"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/routers/base"
)

func List(ctx *base.WebContext) {
	rctx := ctx.Request.Context()

	cursor := strings.TrimSpace(ctx.Input.Query("cursor"))
	limit := strings.TrimSpace(ctx.Input.Query("limit"))
	sort := strings.TrimSpace(ctx.Input.Query("sort"))

	var l int
	var err error
	l, err = strconv.Atoi(limit)
	if err != nil {
		l = notes.DefaultLimit
	}

	sk := notes.FromSortString(sort)
	mn, nextCursor, err := notes.FindNotesForWorkspace(rctx, ctx.Workspace.Id, cursor, l, sk)
	if err != nil {
		if errors.Is(err, notes.ErrLimitTooHigh) {
			base.BadRequest(ctx, err)
			return
		}

		base.InternalError(ctx, err)
		return
	}

	uiNotes := make([]*models.Note, 0, len(mn))
	for _, n := range mn {
		mn, err := modelForNote(n)
		if err != nil {
			base.InternalError(ctx, err)
			return
		}

		uiNotes = append(uiNotes, mn)
	}

	base.Respond(ctx, map[string]any{
		"notes":      uiNotes,
		"nextCursor": nextCursor,
	}, http.StatusOK)
}
