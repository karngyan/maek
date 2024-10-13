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
	Id                 uint64       `json:"id"`
	Name               string       `json:"name"`
	Email              string       `json:"email" orm:"unique"`
	Password           string       `json:"-" orm:"type(text)"`
	Verified           bool         `json:"verified"`
	Role               UserRole     `json:"role"`
	DefaultWorkspaceId uint64       `json:"defaultWorkspaceId"`
	Workspaces         []*Workspace `json:"-" orm:"rel(m2m)"`
	Created            int64        `json:"created"`
	Updated            int64        `json:"updated"`
}

func (u *User) TableEngine() string {
	return "InnoDB"
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
