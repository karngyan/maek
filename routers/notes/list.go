package notes

import (
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/routers/base"
	"github.com/karngyan/maek/routers/models"
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
	bundle, err := notes.FindNotesForWorkspace(rctx, ctx.WorkspaceID, cursor, l, sk)
	if err != nil {
		if errors.Is(err, notes.ErrLimitTooHigh) {
			base.BadRequest(ctx, err)
			return
		}

		base.InternalError(ctx, err)
		return
	}

	uiNotes := make([]*models.Note, 0, len(bundle.Notes))
	for _, n := range bundle.Notes {
		mn, err := models.ModelForNote(n)
		if err != nil {
			base.InternalError(ctx, err)
			return
		}

		uiNotes = append(uiNotes, mn)
	}

	uiAuthors := make([]*models.User, 0, len(bundle.Authors))
	for _, u := range bundle.Authors {
		uiAuthors = append(uiAuthors, models.ModelForUser(u))
	}

	base.Respond(ctx, map[string]any{
		"notes":      uiNotes,
		"authors":    uiAuthors,
		"nextCursor": bundle.NextCursor,
	}, http.StatusOK)
}
