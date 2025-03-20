package favorites

import (
	"strconv"

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
	l, _ = strconv.Atoi(limit)

}
