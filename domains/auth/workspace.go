package auth

type Workspace struct {
	Id          uint64  `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description" orm:"type(text)"`
	Users       []*User `json:"-" orm:"reverse(many)"`
	Created     int64   `json:"created"`
	Updated     int64   `json:"updated"`
}

func (w *Workspace) TableEngine() string {
	return "InnoDB"
}
