package collections

import (
	"strconv"

	"github.com/karngyan/maek/routers/base"
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

}
