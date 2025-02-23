package notes

import (
	"net/http"

	"github.com/karngyan/maek/domains/collections"
	"github.com/karngyan/maek/ui_api/models"
	"github.com/karngyan/maek/ui_api/web"
	"github.com/labstack/echo/v4"
)

func listCollectionsForNote(ctx web.Context) error {
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
	cs, err := collections.FindCollectionsForNoteUUID(rctx, wid, nuuid)
	if err != nil {
		return ctx.InternalError(err)
	}

	return ctx.JSON(http.StatusOK, map[string]any{
		"collections": models.ModelForCollections(cs),
	})
}
