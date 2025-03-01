package favorites

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/karngyan/maek/domains/collections"
	"github.com/karngyan/maek/ui_api/models"
	"github.com/karngyan/maek/ui_api/web"
	"github.com/labstack/echo/v4"
)

func list(ctx web.Context) error {
	var limit string

	echo.QueryParamsBinder(ctx).
		String("limit", &limit)

	rctx := ctx.Request().Context()

	var l int
	var err error
	l, err = strconv.Atoi(limit)
	if err != nil {
		l = collections.DefaultLimit
	}

	bundle, err := collections.FindCollectionsForWorkspace(rctx, ctx.WorkspaceID, cursor, l, sk)
	if err != nil {
		if errors.Is(err, collections.ErrLimitTooHigh) {
			return ctx.JSON(http.StatusBadRequest, map[string]any{
				"limit": "limit is too high",
			})
		}

		return ctx.InternalError(err)
	}

	uiCollections := make([]*models.Collection, 0, len(bundle.Collections))

	for _, c := range bundle.Collections {
		uiCollections = append(uiCollections, models.ModelForCollection(c))
	}

	return ctx.JSON(http.StatusOK, map[string]any{
		"collections": uiCollections,
		"notes":       bundle.NextCursor,
	})

}
