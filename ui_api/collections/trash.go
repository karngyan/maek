package collections

import (
	"errors"
	"net/http"

	"github.com/karngyan/maek/domains/collections"
	"github.com/karngyan/maek/ui_api/web"
	"github.com/labstack/echo/v4"
)

func trash(ctx web.Context) error {
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

	rctx := ctx.Request().Context()

	err := collections.TrashCollection(rctx, wid, cid, ctx.Session.UserID)
	if err != nil {
		if errors.Is(err, collections.ErrCollectionNotFound) {
			return ctx.JSON(http.StatusNotFound, map[string]any{
				"error": "Collection not found",
			})
		}
		return ctx.InternalError(err)
	}

	return ctx.JSON(http.StatusOK, map[string]any{
		"message": "Collection trashed successfully",
	})
}
