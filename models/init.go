package models

import (
  "github.com/beego/beego/v2/client/orm"

  "github.com/karngyan/maek/conf"
)

func Init() error {
  var err error

  if err = registerModels(); err != nil {
    return err
  }

  // local dev hack
  if conf.IsDevEnv() {
    if err := orm.RunSyncdb("default", false, true); err != nil {
      return err
    }
  }

  return nil
}

func registerModels() error {
  var ms = []any{
    new(User),
  }

  for _, m := range ms {
    orm.RegisterModel(m)
  }

  return nil
}
