package collections

import (
	"github.com/beego/beego/v2/core/logs"
	"github.com/beego/beego/v2/server/web"
	"github.com/karngyan/maek/routers/base"
)

func Configure(l *logs.BeeLogger) {
	web.Post("/v1/workspaces/:workspace_id/collections", base.WrapAuthenticated(Create, l))
}
