package auth

import (
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"

	"github.com/karngyan/maek/ui_api/web"
)

func Configure(e *echo.Echo, l *zap.Logger) {
	e.POST("/v1/auth/register", web.WrapPublicRoute(register, l))
	e.POST("/v1/auth/login", web.WrapPublicRoute(login, l))
	e.GET("/v1/auth/logout", web.WrapAuthenticated(logout, l))
	e.GET("/v1/auth/info", web.WrapAuthenticatedWithUserAllWorkspaces(info, l))
	e.PUT("/v1/auth/user", web.WrapAuthenticated(updateUser, l))
	e.PUT("/v1/auth/workspaces/:workspace_id", web.WrapAuthenticated(updateWorkspace, l))
	e.POST("/v1/auth/workspaces", web.WrapAuthenticated(addNewWorkspaceForUser, l))
}
