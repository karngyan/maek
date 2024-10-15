package routers

import (
	"github.com/beego/beego/v2/core/logs"
	"github.com/karngyan/maek/routers/auth"
	"github.com/karngyan/maek/routers/notes"
)

func Init(l *logs.BeeLogger) error {
	auth.Configure(l)
	notes.Configure(l)
	return nil
}
