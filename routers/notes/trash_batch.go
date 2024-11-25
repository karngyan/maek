package notes

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/routers/base"
)

func TrashBatch(ctx *base.WebContext) {
	note_uuids := make([]string, 0)

	err := ctx.Input.Bind(&note_uuids, "note_uuids")
	if err != nil {
		base.BadRequest(ctx, map[string]interface{}{
			"note_uuids": "note_uuids is not a valid list of strings",
		})
		return
	}

	if len(note_uuids) == 0 {
		base.BadRequest(ctx, map[string]interface{}{
			"note_uuids": "note_uuids is required",
		})
		return
	}

	rctx := ctx.Request.Context()

	err = notes.TrashNoteMultiCtx(rctx, note_uuids, ctx.Workspace.Id, ctx.User)
	if err != nil {
		if errors.Is(err, notes.ErrNoteNotFound) {
			base.BadRequest(ctx, map[string]interface{}{
				"note_uuids": "Note not found",
			})
			return
		}
		base.InternalError(ctx, err)
		return
	}

	base.Respond(ctx, map[string]interface{}{
		"message": fmt.Sprintf("%d notes trashed successfully", len(note_uuids)),
	}, http.StatusOK)
}
