package notes

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/routers/base"
)

func Get(ctx *base.WebContext) {
	nid := ctx.Input.Param(":note_id")
	wid := ctx.Workspace.Id

	noteId, err := strconv.ParseUint(nid, 10, 64)
	if err != nil {
		base.BadRequest(ctx, fmt.Errorf("invalid note id: %s", nid))
		return
	}

	rctx := ctx.Request.Context()
	n, err := notes.FindNoteById(rctx, noteId, wid)
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
