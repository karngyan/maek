package routers

import (
	"github.com/beego/beego/v2/core/logs"
	"github.com/karngyan/maek/routers/auth"
)

func Init(l *logs.BeeLogger) error {
	auth.Configure(l)
	return nil
}
