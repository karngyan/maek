package collections

import (
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"

	"github.com/karngyan/maek/ui_api/web"
)

func Configure(e *echo.Echo, l *zap.Logger) {
	e.POST("/v1/workspaces/:workspace_id/collections", web.WrapAuthenticated(create, l))
	e.GET("/v1/workspaces/:workspace_id/collections/:collection_id", web.WrapAuthenticated(get, l))
}
