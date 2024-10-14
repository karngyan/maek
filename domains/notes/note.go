package notes

import "github.com/karngyan/maek/domains/auth"

type Note struct {
	Id        uint64
	Content   string `orm:"type(text)"`
	Favorite  bool
	Workspace *auth.Workspace `orm:"rel(fk)"`
	Created   int64
	Updated   int64
	CreatedBy *auth.User `orm:"rel(fk)"`
	UpdatedBy *auth.User `orm:"rel(fk)"`
}

func (n *Note) TableEngine() string {
	return "InnoDB"
}
