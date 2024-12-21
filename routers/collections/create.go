package collections

import (
	"net/http"

	"github.com/karngyan/maek/domains/collections"
	"github.com/karngyan/maek/routers/base"
	"github.com/karngyan/maek/routers/models"
)

func Create(ctx *base.WebContext) {
	rctx := ctx.Request.Context()

	collection, err := collections.CreateCollection(rctx, ctx.WorkspaceID, ctx.Session.UserID)
	if err != nil {
		base.InternalError(ctx, err)
		return
	}

	base.Respond(ctx, map[string]any{
		"collection": models.ModelForCollection(collection),
	}, http.StatusCreated)
}
