package auth

import (
	"errors"

	"golang.org/x/crypto/bcrypt"
)

type UserRole string

const (
	RoleAdmin UserRole = "admin"
	RoleUser  UserRole = "user"
)

var ErrUserNotFound = errors.New("user not found")

type User struct {
	Id                 uint64
	Name               string
	Email              string `orm:"unique"`
	Password           string `orm:"type(text)"`
	Verified           bool
	Role               UserRole
	DefaultWorkspaceId uint64
	Workspaces         []*Workspace `orm:"rel(m2m)"`
	Created            int64
	Updated            int64
}

func (u *User) verifyPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}

func (u *User) hashPassword() error {
	bytes, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	u.Password = string(bytes)
	return nil
}
