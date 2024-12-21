package notes

import (
	"errors"
	"net/http"
	"strings"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/routers/base"
)

func Trash(ctx *base.WebContext) {
	nuuid := strings.TrimSpace(ctx.Input.Param(":note_uuid"))
	if nuuid == "" {
		base.BadRequest(ctx, map[string]any{
			"note_uuid": "note_uuid is required",
		})
		return
	}

	rctx := ctx.Request.Context()

	err := notes.TrashNote(rctx, nuuid, ctx.WorkspaceID, ctx.Session.UserID)
	if err != nil {
		if errors.Is(err, notes.ErrNoteNotFound) {
			base.BadRequest(ctx, map[string]any{
				"note_uuid": "Note not found",
			})
			return
		}
		base.InternalError(ctx, err)
		return
	}

	base.Respond(ctx, map[string]any{
		"message": "Note trashed successfully",
	}, http.StatusOK)
}
