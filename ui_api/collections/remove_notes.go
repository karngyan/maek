package collections

import (
	"net/http"

	"github.com/karngyan/maek/domains/collections"

	"github.com/karngyan/maek/ui_api/web"
	"github.com/labstack/echo/v4"
)

func removeNotes(ctx web.Context) error {
	var (
		cid int64
		wid int64
	)
	echo.PathParamsBinder(ctx).
		Int64("collection_id", &cid).
		Int64("workspace_id", &wid)

	if cid == 0 {
		return ctx.JSON(http.StatusBadRequest, map[string]any{
			"collection_id": "collection_id is required",
		})
	}

	var req struct {
		NoteIDs []int64 `json:"noteIds"`
	}
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusUnprocessableEntity, map[string]any{
			"error": err.Error(),
		})
	}

	rctx := ctx.Request().Context()
	err := collections.RemoveNotesToCollection(rctx, wid, cid, req.NoteIDs)
	if err != nil {
		return ctx.InternalError(err)
	}

	return ctx.JSON(http.StatusOK, map[string]any{
		"message": "Notes removed from collection successfully",
	})
}
