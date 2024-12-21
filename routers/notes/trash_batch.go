package notes

import (
	"fmt"
	"net/http"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/routers/base"
)

func TrashBatch(ctx *base.WebContext) {
	noteUuids := make([]string, 0)

	err := ctx.Input.Bind(&noteUuids, "note_uuids")
	if err != nil {
		base.BadRequest(ctx, map[string]interface{}{
			"note_uuids": "note_uuids is not a valid list of strings",
		})
		return
	}

	if len(noteUuids) == 0 {
		base.BadRequest(ctx, map[string]interface{}{
			"note_uuids": "note_uuids is required",
		})
		return
	}

	rctx := ctx.Request.Context()

	err = notes.TrashNoteMulti(rctx, noteUuids, ctx.WorkspaceID, ctx.Session.UserID)
	if err != nil {
		base.InternalError(ctx, err)
		return
	}

	base.Respond(ctx, map[string]interface{}{
		"message": fmt.Sprintf("%d notes trashed successfully", len(noteUuids)),
	}, http.StatusOK)
}
