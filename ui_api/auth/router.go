package auth

import (
	"github.com/karngyan/maek/ui_api/web"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

func Configure(e *echo.Echo, l *zap.Logger) {
	e.POST("/v1/auth/register", web.WrapPublicRoute(register, l))
	e.POST("/v1/auth/login", web.WrapPublicRoute(login, l))
	e.GET("/v1/auth/logout", web.WrapAuthenticated(logout, l))
	e.GET("/v1/auth/info", web.WrapAuthenticatedWithUserAllWorkspaces(info, l))
	e.PUT("/v1/auth/user", web.WrapAuthenticated(updateUser, l))
}
