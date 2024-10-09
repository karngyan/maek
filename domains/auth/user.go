package auth

import (
	"context"
	"errors"
	"fmt"
)

type UserRole string

const (
	RoleAdmin UserRole = "admin"
	RoleUser  UserRole = "user"
)

var ErrUserNotFound = errors.New("user not found")

type User struct {
	Id       uint64     `json:"id"`
	Name     string     `json:"name"`
	Email    string     `json:"email" orm:"unique"`
	Password string     `json:"-" orm:"type(text)"`
	Verified bool       `json:"verified"`
	Role     UserRole   `json:"role"`
	Accounts []*Account `json:"-" orm:"rel(m2m)"`
	Created  int64      `json:"created"`
	Updated  int64      `json:"updated"`
}

func (u *User) TableEngine() string {
	return "InnoDB"
}

func FetchUserById(ctx context.Context, id uint64) (User, error) {
	key := fmt.Sprintf("%d", id)
	if user, err := userCache.Get(ctx, key); err == nil {
		return user.(User), nil
	}

	// cache is read through so if Get failed user doesn't exist in db
	return User{}, ErrUserNotFound
}
