package domains

import (
	"github.com/beego/beego/v2/client/orm"
	"github.com/beego/beego/v2/core/logs"
	"github.com/karngyan/maek/domains/auth"
)

func Init() error {
	var err error

	if err = registerModels(); err != nil {
		return err
	}

	// local dev hack
	// if conf.IsDevEnv() {
	// 	if err := orm.RunSyncdb("default", false, true); err != nil {
	// 		return err
	// 	}
	// }

	if err = initCaches(); err != nil {
		return err
	}

	return nil
}

func registerModels() error {
	var ms = [][]any{
		auth.Models,
	}

	for _, m := range ms {
		for _, mo := range m {
			orm.RegisterModel(mo)
		}
	}

	return nil
}

func initCaches() error {
	if err := auth.CacheInit(); err != nil {
		return err
	}

	return nil
}

// InitTest initializes the test database
func InitTest() error {
	var err error

	if err = registerModels(); err != nil {
		return err
	}

	// force cleans up the database
	if err := orm.RunSyncdb("default", true, false); err != nil {
		return err
	}

	return nil
}

// CleanupTest cleans up the test database
func CleanupTest() {
	// force would drop the tables and recreate them
	err := orm.RunSyncdb("default", true, false)
	if err != nil {
		logs.Info("Error cleaning up test database: %v", err)
	} else {
		logs.Info("Cleaned up test database")
	}
}
