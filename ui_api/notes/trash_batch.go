package notes

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/ui_api/web"
)

func trashBatch(ctx web.Context) error {

	noteUuids := make([]string, 0)
	echo.QueryParamsBinder(ctx).Strings("note_uuids", &noteUuids)

	if len(noteUuids) == 0 {
		return ctx.JSON(http.StatusBadRequest, map[string]any{
			"note_uuids": "note_uuids is required",
		})
	}

	rctx := ctx.Request().Context()

	err := notes.TrashNoteMulti(rctx, noteUuids, ctx.WorkspaceID, ctx.Session.UserID)
	if err != nil {
		return ctx.InternalError(err)
	}

	return ctx.JSON(http.StatusOK, map[string]any{
		"message": fmt.Sprintf("%d notes trashed successfully", len(noteUuids)),
	})
}
