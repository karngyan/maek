package routers

import (
	"github.com/beego/beego/v2/core/logs"
	"github.com/karngyan/maek/routers/collections"
	"github.com/karngyan/maek/routers/notes"
)

func Init(l *logs.BeeLogger) error {
	notes.Configure(l)
	collections.Configure(l)
	return nil
}
