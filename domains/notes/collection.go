package notes

import (
	"github.com/karngyan/maek/domains/auth"
)

type Collection struct {
	Id          uint64
	Name        string
	Description string `orm:"type(text)"`
	Created     int64
	Updated     int64
	Trashed     bool
	Deleted     bool
	Notes       []*Note         `orm:"rel(m2m)"`
	Workspace   *auth.Workspace `orm:"rel(fk)"`
	CreatedBy   *auth.User      `orm:"rel(fk)"`
	UpdatedBy   *auth.User      `orm:"rel(fk)"`
}

func (c *Collection) TableEngine() string {
	return "InnoDB"
}
