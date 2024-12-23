package logger

import (
	"context"
	"errors"
	"fmt"
	"syscall"

	"go.uber.org/fx"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"

	"github.com/karngyan/maek/config"
)

func New(lc fx.Lifecycle, c *config.Config) (*zap.Logger, error) {
	cfg := zap.NewProductionConfig()
	if c.IsDev() {
		cfg = zap.NewDevelopmentConfig()
		cfg.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
	}

	l, err := cfg.Build()
	if err != nil {
		return nil, err
	}

	lc.Append(fx.Hook{
		OnStop: func(ctx context.Context) error {
			l.Info("syncing logger before shutdown")
			err := l.Sync()

			// ignore ENOTTY errors when logs are written to a console
			// https://github.com/uber-go/zap/issues/991#issuecomment-962098428
			if err != nil && !errors.Is(err, syscall.ENOTTY) {
				return err
			}

			return nil
		},
	})

	return l, nil
}

func NewNop() *zap.Logger {
	return zap.NewNop()
}

type BigCacheLogger struct {
	*zap.Logger
}

func NewBigCacheLogger(l *zap.Logger) *BigCacheLogger {
	return &BigCacheLogger{l}
}

// Printf is a convenience method to log a message using Printf-style formatting.
// bigcache.Logger interface implementation
func (z *BigCacheLogger) Printf(format string, v ...interface{}) {
	z.Info(fmt.Sprintf(format, v...))
}
