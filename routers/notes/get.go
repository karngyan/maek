package notes

import (
	"net/http"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/routers/base"
)

func Get(ctx *base.WebContext) {
	nuuid := ctx.Input.Param(":note_uuid")
	wid := ctx.Workspace.Id

	if nuuid == "" {
		base.BadRequest(ctx, map[string]any{
			"note_uuid": "note_uuid is required",
		})
		return
	}

	rctx := ctx.Request.Context()
	n, err := notes.FindNoteByUuid(rctx, nuuid, wid)
	if err != nil {
		base.NotFound(ctx, err)
		return
	}

	uiNote, err := modelForNote(n)
	if err != nil {
		base.InternalError(ctx, err)
		return
	}

	base.Respond(ctx, map[string]any{
		"note": uiNote,
	}, http.StatusOK)
}
