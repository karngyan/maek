package notes

import "github.com/karngyan/maek/domains/auth"

type Note struct {
	Id        uint64
	Uuid      string
	Content   string          `orm:"type(text)"`
	Favorite  bool            `orm:"default(false)"`
	Trashed   bool            `orm:"default(false)"`
	Deleted   bool            `orm:"default(false)"` // soft delete
	Workspace *auth.Workspace `orm:"rel(fk)"`
	Created   int64
	Updated   int64
	CreatedBy *auth.User `orm:"rel(fk)"`
	UpdatedBy *auth.User `orm:"rel(fk)"`
}

func (n *Note) TableEngine() string {
	return "InnoDB"
}
