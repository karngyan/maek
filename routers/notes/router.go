package notes

import (
	"github.com/beego/beego/v2/core/logs"
	"github.com/beego/beego/v2/server/web"

	"github.com/karngyan/maek/routers/base"
)

func Configure(l *logs.BeeLogger) {
	web.Get("/v1/workspaces/:workspace_id/notes", base.WrapAuthenticated(List, l))
	web.Put("/v1/workspaces/:workspace_id/notes/:note_uuid", base.WrapAuthenticated(Upsert, l))
	web.Get("/v1/workspaces/:workspace_id/notes/:note_uuid", base.WrapAuthenticated(Get, l))
	web.Delete("/v1/workspaces/:workspace_id/notes/:note_uuid", base.WrapAuthenticated(Trash, l))
}
