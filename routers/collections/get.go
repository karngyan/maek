package collections

import (
	"net/http"
	"strconv"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/routers/base"
	"github.com/karngyan/maek/routers/models"
)

func Get(ctx *base.WebContext) {
	cids := ctx.Input.Param(":collection_id")
	wid := ctx.Workspace.Id

	if cids == "" {
		base.BadRequest(ctx, map[string]interface{}{
			"collection_id": "collection_id is required",
		})
		return
	}

	cid, err := strconv.ParseUint(cids, 10, 64)
	if err != nil {
		base.BadRequest(ctx, map[string]interface{}{
			"collection_id": "collection_id is not a valid number",
		})
		return
	}

	rctx := ctx.Request.Context()
	c, err := notes.FindCollectionByID(rctx, wid, cid, true)
	if err != nil {
		base.NotFound(ctx, err)
		return
	}

	uiC := models.ModelForCollection(c)

	base.Respond(ctx, map[string]any{
		"collection": uiC,
	}, http.StatusOK)

}
