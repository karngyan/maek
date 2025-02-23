package domains

import (
	"github.com/karngyan/maek/config"
	"github.com/karngyan/maek/domains/auth"
	"github.com/karngyan/maek/domains/notes"
	"go.uber.org/zap"
)

func Init(l *zap.Logger, c *config.Config) error {
	var err error

	if err = auth.Init(l, c); err != nil {
		return err
	}

	if err = notes.Init(l, c); err != nil {
		return err
	}

	l.Info("domains initialized")

	return nil
}
