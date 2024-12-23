package main

import (
	"github.com/karngyan/maek/config"
	"github.com/karngyan/maek/libs/logger"
	"github.com/karngyan/maek/ui_api"
	"go.uber.org/fx"
	"go.uber.org/fx/fxevent"
	"go.uber.org/zap"
)

func main() {
	fx.New(
		fx.Provide(
			config.New,
			logger.New,
		),
		fx.Decorate(func(l *zap.Logger) *zap.Logger {
			return l.With(zap.String("service", "ui_api"))
		}),
		fx.Invoke(ui_api.Run),
		fx.WithLogger(func(l *zap.Logger) fxevent.Logger {
			return &fxevent.ZapLogger{
				Logger: l,
			}
		}),
	).Run()
}
