package notes

import (
	"net/http"

	"github.com/karngyan/maek/domains/collections"
	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/ui_api/models"

	"github.com/karngyan/maek/ui_api/web"
	"github.com/labstack/echo/v4"
)

func removeCollections(ctx web.Context) error {
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

	var req struct {
		CollectionIDs []int64 `json:"collectionIds"`
	}

	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusUnprocessableEntity, map[string]any{
			"error": err.Error(),
		})
	}

	rctx := ctx.Request().Context()
	err := notes.RemoveCollectionsFromNote(rctx, wid, nuuid, req.CollectionIDs)
	if err != nil {
		return ctx.InternalError(err)
	}

	cs, err := collections.FindCollectionsForNoteUUID(rctx, wid, nuuid)
	if err != nil {
		return ctx.InternalError(err)
	}

	return ctx.JSON(http.StatusOK, map[string]any{
		"collections": models.ModelForCollections(cs),
	})
}
