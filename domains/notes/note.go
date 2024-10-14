package notes

import "github.com/karngyan/maek/domains/auth"

type Note struct {
	Id        uint64
	Content   string `orm:"type(text)"`
	Favorite  bool
	Workspace *auth.Workspace
	Created   int64
	Updated   int64
	CreatedBy *auth.User
	UpdatedBy *auth.User
}
