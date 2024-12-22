package notes

import (
	"errors"
	"net/http"

	"github.com/karngyan/maek/routers/models"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/routers/base"
)

func Get(ctx *base.WebContext) {
	nuuid := ctx.Input.Param(":note_uuid")
	wid := ctx.WorkspaceID

	if nuuid == "" {
		base.BadRequest(ctx, map[string]any{
			"note_uuid": "note_uuid is required",
		})
		return
	}

	rctx := ctx.Request.Context()
	n, err := notes.FindNoteByUUID(rctx, nuuid, wid)
	if err != nil {
		if errors.Is(err, notes.ErrNoteNotFound) {
			base.NotFound(ctx, err)
			return
		}

		base.InternalError(ctx, err)
		return
	}

	uiNote, err := models.ModelForNote(n)
	if err != nil {
		base.InternalError(ctx, err)
		return
	}

	base.Respond(ctx, map[string]any{
		"note": uiNote,
	}, http.StatusOK)
}
