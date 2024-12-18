package domains

import (
	"github.com/beego/beego/v2/client/orm"
	"github.com/karngyan/maek/domains/auth"
	"github.com/karngyan/maek/domains/notes"
)

func Init() error {
	var err error

	if err = registerModels(); err != nil {
		return err
	}

	// local dev hack
	// if err := orm.RunSyncdb("default", false, true); err != nil {
	// 	return err
	// }

	if err = initCaches(); err != nil {
		return err
	}

	return nil
}

func registerModels() error {
	var ms = [][]any{
		auth.Models,
		notes.Models,
	}

	for _, m := range ms {
		for _, mo := range m {
			orm.RegisterModel(mo)
		}
	}

	return nil
}

func initCaches() error {
	if err := auth.InitCache(); err != nil {
		return err
	}

	return nil
}

// InitTest initializes the test database + caches
func InitTest() error {
	var err error

	if err = registerModels(); err != nil {
		return err
	}

	// // force cleans up the database
	// if err := orm.RunSyncdb("default", true, false); err != nil {
	// 	return err
	// }

	if err = initCaches(); err != nil {
		return err
	}

	return nil
}
