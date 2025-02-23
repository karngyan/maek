package notes

import (
	"net/http"

	"github.com/karngyan/maek/ui_api/web"
	"github.com/karngyan/maek/ysweet"
)

func getCollaborationToken(ctx web.Context) error {
	var req struct {
		DocID string `json:"docId"`
	}

	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusUnprocessableEntity, map[string]any{
			"error": err.Error(),
		})
	}

	clt, err := ysweet.GenerateReadWriteClientInfo(req.DocID, ctx.Session.UserID, ctx.Session.Age())
	if err != nil {
		return ctx.InternalError(err)
	}

	return ctx.JSON(http.StatusOK, clt)
}
