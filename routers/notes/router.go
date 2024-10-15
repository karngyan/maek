package notes

import (
	"github.com/beego/beego/v2/core/logs"
	"github.com/beego/beego/v2/server/web"

	"github.com/karngyan/maek/routers/base"
)

func Configure(l *logs.BeeLogger) {
	web.Get("/v1/workspaces/:workspace_id/notes", base.WrapAuthenticated(List, l))
	web.Post("/v1/workspaces/:workspace_id/notes", base.WrapAuthenticated(Create, l))
}
