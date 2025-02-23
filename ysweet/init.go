package ysweet

import (
	"errors"
	"fmt"
	"time"

	"go.uber.org/fx"
	"go.uber.org/zap"

	"github.com/karngyan/maek/config"
	"github.com/karngyan/maek/libs/ysweet"
)

var (
	dom *ysweet.DocumentManager
)

var (
	fullAuth = ysweet.FullAuthorization
)

func Init(lc fx.Lifecycle, c *config.Config, l *zap.Logger) error {
	cs := c.String("ysweet.connection_string")
	if cs == "" {
		return errors.New("ysweet connection string not set")
	}

	var err error
	dom, err = ysweet.NewDocumentManager(cs)
	if err != nil {
		return err
	}

	return nil
}

func GenerateReadWriteClientInfo(docID string, userID int64, age time.Duration) (ysweet.ClientToken, error) {
	uid := fmt.Sprintf("%d", userID)
	validity := int(age.Seconds())

	return dom.GetOrCreateDocAndToken(&docID, &ysweet.AuthDocRequest{
		Authorization:   &fullAuth,
		UserID:          &uid,
		ValidForSeconds: &validity,
	})
}
