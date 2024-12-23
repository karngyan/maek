package auth

import (
	"github.com/karngyan/maek/ui_api/web"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

func Configure(e *echo.Echo, l *zap.Logger) {
	e.POST("/v1/auth/login", web.WrapPublicRoute(login, l))
}
