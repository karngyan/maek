package favorites

import (
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"

	"github.com/karngyan/maek/ui_api/web"
)

func Configure(e *echo.Echo, l *zap.Logger) {
	e.GET("/v1/workspaces/:workspace_id/favorites", web.WrapAuthenticated(list, l))
}
