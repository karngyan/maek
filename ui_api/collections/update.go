package collections

import (
	"errors"
	"net/http"

	"github.com/karngyan/maek/ui_api/models"

	"github.com/karngyan/maek/domains/collections"
	"github.com/karngyan/maek/ui_api/web"
	"github.com/labstack/echo/v4"
)

func update(ctx web.Context) error {
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
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusUnprocessableEntity, map[string]any{
			"error": err.Error(),
		})
	}

	rctx := ctx.Request().Context()
	collection, err := collections.UpdateCollection(rctx, &collections.UpdateCollectionRequest{
		ID:          cid,
		Name:        req.Name,
		Description: req.Description,
		WorkspaceID: wid,
		UpdatedByID: ctx.Session.UserID,
	})
	if err != nil {
		if errors.Is(err, collections.ErrCollectionNotFound) {
			return ctx.JSON(http.StatusNotFound, map[string]any{
				"error": "Collection not found",
			})
		}

		return ctx.InternalError(err)
	}

	return ctx.JSON(http.StatusOK, map[string]any{
		"collection": models.ModelForCollection(collection),
	})
}
