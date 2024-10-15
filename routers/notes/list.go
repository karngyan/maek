package notes

import (
	"net/http"

	"github.com/karngyan/maek/routers/models"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/routers/base"
)

func List(ctx *base.WebContext) {
	rctx := ctx.Request.Context()

	mn, err := notes.FetchNotesForWorkspace(rctx, ctx.Workspace.Id)
	if err != nil {
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
		"notes": uiNotes,
	}, http.StatusOK)
}
