package auth

import (
	"github.com/beego/beego/v2/core/logs"
	"github.com/beego/beego/v2/server/web"

	"github.com/karngyan/maek/routers/base"
)

func Configure(l *logs.BeeLogger) {
	web.Post("/v1/auth/register", base.WrapPublicRoute(Register, l))
	web.Post("/v1/auth/login", base.WrapPublicRoute(Login, l))
	web.Get("/v1/auth/logout", base.WrapAuthenticated(Logout, l))
}
