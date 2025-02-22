package notes

import (
	"fmt"
	"net/http"

	"github.com/karngyan/maek/libs/ysweet"

	"github.com/karngyan/maek/ui_api/web"
)

func getCollaborationToken(ctx web.Context) error {
	var req struct {
		DocID          string `json:"docId"`
		InitialContent string `json:"initialContent"`
	}

	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusUnprocessableEntity, map[string]any{
			"error": err.Error(),
		})
	}

	manager, err := ysweet.NewDocumentManager("ys://localhost:8081")
	if err != nil {
		return ctx.InternalError(err)
	}

	userID := fmt.Sprintf("%d", ctx.Session.UserID)
	ath := ysweet.FullAuthorization
	validity := int(ctx.Session.Age().Seconds())

	clt, err := manager.GetOrCreateDocAndToken(&req.DocID, &ysweet.AuthDocRequest{
		Authorization:   &ath,
		UserID:          &userID,
		ValidForSeconds: &validity,
		InitialContent:  &req.InitialContent,
	})

	if err != nil {
		return ctx.InternalError(err)
	}

	return ctx.JSON(http.StatusOK, clt)
}
