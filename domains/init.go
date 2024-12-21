package domains

import (
	"github.com/karngyan/maek/domains/auth"
)

func Init() error {
	var err error

	if err = initCaches(); err != nil {
		return err
	}

	return nil
}

func initCaches() error {
	if err := auth.InitCache(); err != nil {
		return err
	}

	return nil
}

func InitTest() error {
	var err error

	if err = initCaches(); err != nil {
		return err
	}

	return nil
}
