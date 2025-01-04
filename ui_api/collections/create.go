package collections

import (
	"net/http"

	"github.com/karngyan/maek/domains/collections"
	"github.com/karngyan/maek/ui_api/models"
	"github.com/karngyan/maek/ui_api/web"
)

func create(ctx web.Context) error {
	rctx := ctx.Request().Context()

	collection, err := collections.CreateCollection(rctx, ctx.WorkspaceID, ctx.Session.UserID)
	if err != nil {
		return ctx.InternalError(err)
	}

	return ctx.JSON(http.StatusCreated, map[string]any{
		"collection": models.ModelForCollection(collection),
		"notes":      []any{},
	})
}
