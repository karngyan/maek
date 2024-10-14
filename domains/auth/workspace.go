package auth

type Workspace struct {
	Id          uint64
	Name        string
	Description string  `orm:"type(text)"`
	Users       []*User `orm:"reverse(many)"`
	Created     int64
	Updated     int64
}

func (w *Workspace) TableEngine() string {
	return "InnoDB"
}
