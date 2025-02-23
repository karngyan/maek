package notes

import (
	"errors"
	"net/http"

	"github.com/labstack/echo/v4"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/ui_api/web"
	"github.com/karngyan/maek/ysweet"
)

func getCollaborationInfo(ctx web.Context) error {
	var nuuid string

	echo.PathParamsBinder(ctx).
		String("note_uuid", &nuuid)

	rctx := ctx.Request().Context()
	ni, err := notes.FindNoteInfo(rctx, nuuid)
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

	clt, err := ysweet.GenerateReadWriteClientInfo(nuuid, ctx.Session.UserID, ctx.Session.Age())
	if err != nil {
		return ctx.InternalError(err)
	}

	return ctx.JSON(http.StatusOK, clt)
}
