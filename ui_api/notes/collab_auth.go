package notes

import (
	"errors"
	"net/http"

	"github.com/karngyan/maek/domains/notes"

	"github.com/karngyan/maek/ui_api/web"
	"github.com/karngyan/maek/ysweet"
)

func getCollaborationToken(ctx web.Context) error {
	var req struct {
		DocID string `json:"docId"`
	}

	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusUnprocessableEntity, map[string]any{
			"error": err.Error(),
		})
	}

	rctx := ctx.Request().Context()
	ni, err := notes.FindNoteInfo(rctx, req.DocID)
	if err != nil {
		if errors.Is(err, notes.ErrNoteNotFound) {
			// it's okay we'll create a new note
		} else {
			return ctx.InternalError(err)
		}
	} else {
		// not is found lets make sure its part of the same workspace
		if ni.WorkspaceID != ctx.WorkspaceID {
			return ctx.NoContent(http.StatusBadRequest)
		}
	}

	clt, err := ysweet.GenerateReadWriteClientInfo(req.DocID, ctx.Session.UserID, ctx.Session.Age())
	if err != nil {
		return ctx.InternalError(err)
	}

	return ctx.JSON(http.StatusOK, clt)
}
