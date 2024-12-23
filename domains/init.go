package domains

import (
	"github.com/karngyan/maek/domains/auth"
	"go.uber.org/zap"
)

func Init(l *zap.Logger) error {
	var err error

	if err = auth.InitCache(); err != nil {
		return err
	}

	l.Info("domains initialized")

	return nil
}
