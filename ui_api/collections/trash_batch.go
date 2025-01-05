package collections

import (
	"fmt"
	"net/http"

	"github.com/karngyan/maek/domains/collections"
	"github.com/karngyan/maek/ui_api/web"
	"github.com/labstack/echo/v4"
)

func trashBatch(ctx web.Context) error {

	cids := make([]int64, 0)
	echo.QueryParamsBinder(ctx).Int64s("cids", &cids)

	if len(cids) == 0 {
		return ctx.JSON(http.StatusBadRequest, map[string]any{
			"cids": "cids is required",
		})
	}

	rctx := ctx.Request().Context()

	err := collections.TrashCollectionMulti(rctx, cids, ctx.WorkspaceID, ctx.Session.UserID)
	if err != nil {
		return ctx.InternalError(err)
	}

	return ctx.JSON(http.StatusOK, map[string]any{
		"message": fmt.Sprintf("%d collections trashed successfully", len(cids)),
	})
}
