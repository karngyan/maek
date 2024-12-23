package notes

import (
	"errors"
	"net/http"

	"github.com/karngyan/maek/domains/notes"

	"github.com/karngyan/maek/ui_api/web"
	"github.com/labstack/echo/v4"
)

func trash(ctx web.Context) error {
	var (
		nuuid string
		wid   int64
	)
	echo.PathParamsBinder(ctx).
		String("note_uuid", &nuuid).
		Int64("workspace_id", &wid)

	if nuuid == "" {
		return ctx.JSON(http.StatusBadRequest, map[string]any{
			"note_uuid": "note_uuid is required",
		})
	}

	rctx := ctx.Request().Context()

	err := notes.TrashNote(rctx, nuuid, wid, ctx.Session.UserID)
	if err != nil {
		if errors.Is(err, notes.ErrNoteNotFound) {
			return ctx.JSON(http.StatusNotFound, map[string]any{
				"error": "Note not found",
			})
		}
		return ctx.InternalError(err)
	}

	return ctx.JSON(http.StatusOK, map[string]any{
		"message": "Note trashed successfully",
	})
}
