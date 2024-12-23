package notes

import (
	"errors"
	"net/http"

	"github.com/labstack/echo/v4"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/routers/models"
	"github.com/karngyan/maek/ui_api/web"
)

func get(ctx web.Context) error {
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
	n, err := notes.FindNoteByUUID(rctx, nuuid, wid)
	if err != nil {
		if errors.Is(err, notes.ErrNoteNotFound) {
			return ctx.JSON(http.StatusNotFound, map[string]any{
				"error": "Note not found",
			})
		}

		return ctx.InternalError(err)
	}

	uiNote, err := models.ModelForNote(n)
	if err != nil {
		return ctx.InternalError(err)
	}

	return ctx.JSON(http.StatusOK, map[string]any{
		"note": uiNote,
	})
}
