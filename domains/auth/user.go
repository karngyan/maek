package auth

import (
	"errors"

	"github.com/karngyan/maek/db"

	"golang.org/x/crypto/bcrypt"
)

type UserRole string

const (
	RoleAdmin UserRole = "admin"
	RoleUser  UserRole = "user"
)

var ErrUserNotFound = errors.New("user not found")

type User struct {
	ID                 int64
	Name               string
	Email              string
	Password           string
	Verified           bool
	Role               UserRole
	DefaultWorkspaceID int64
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

func userRoleFromString(role string) UserRole {
	switch role {
	case "admin":
		return RoleAdmin
	case "user":
		return RoleUser
	default:
		return RoleUser
	}
}

func UserFromDBUser(du *db.User) *User {
	return &User{
		ID:                 du.ID,
		Name:               du.Name,
		Email:              du.Email,
		Verified:           du.Verified,
		Password:           du.Password,
		Role:               userRoleFromString(du.Role),
		DefaultWorkspaceID: du.DefaultWorkspaceID,
		Created:            du.Created,
		Updated:            du.Updated,
	}
}
