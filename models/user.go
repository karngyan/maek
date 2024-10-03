package models

import (
  "context"
  "github.com/beego/beego/v2/client/orm"
)

type User struct {
  Id       uint64 `json:"id"`
  Name     string `json:"name"`
  Email    string `json:"email" orm:"unique"`
  Verified bool   `json:"verified"`
  Created  int64  `json:"created"`
  Updated  int64  `json:"updated"`
}

func (u *User) TableEngine() string {
  return "InnoDB"
}

func (u *User) Insert(ctx context.Context, o orm.Ormer) error {
  u.Id = 0 // auto increment
  _, err := o.InsertWithCtx(ctx, u)
  return err
}

func (u *User) Update(ctx context.Context, o orm.Ormer, fields ...string) error {
  _, err := o.UpdateWithCtx(ctx, u, fields...)
  return err
}

func (u *User) Delete(ctx context.Context, o orm.Ormer) error {
  _, err := o.DeleteWithCtx(ctx, u)
  return err
}

func AllUsers(o orm.Ormer) orm.QuerySeter {
  return o.QueryTable("user")
}
