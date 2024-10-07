package auth

type UserRole string

const (
	RoleAdmin UserRole = "admin"
	RoleUser  UserRole = "user"
)

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
