package collections

import (
	"net/http"

	"github.com/karngyan/maek/routers/models"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/routers/base"
)

func Create(ctx *base.WebContext) {
	rctx := ctx.Request.Context()

	collection, err := notes.CreateCollection(rctx, ctx.Workspace.Id)
	if err != nil {
		base.InternalError(ctx, err)
		return
	}

	base.Respond(ctx, map[string]any{
		"collection": models.ModelForCollection(collection),
	}, http.StatusCreated)
}
