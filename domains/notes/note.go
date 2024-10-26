package notes

import "github.com/karngyan/maek/domains/auth"

type Note struct {
	Id             uint64
	Uuid           string          `orm:"unique"`
	Content        string          `orm:"type(text)"`
	Favorite       bool            `orm:"default(false)"`
	Trashed        bool            `orm:"default(false)"`
	Deleted        bool            `orm:"default(false)"` // soft delete
	HasContent     bool            `orm:"default(false)"`
	HasImages      bool            `orm:"default(false)"`
	HasVideos      bool            `orm:"default(false)"`
	HasOpenTasks   bool            `orm:"default(false)"`
	HasClosedTasks bool            `orm:"default(false)"`
	HasCode        bool            `orm:"default(false)"`
	HasAudios      bool            `orm:"default(false)"`
	HasLinks       bool            `orm:"default(false)"`
	HasFiles       bool            `orm:"default(false)"`
	HasQuotes      bool            `orm:"default(false)"`
	HasTables      bool            `orm:"default(false)"`
	Workspace      *auth.Workspace `orm:"rel(fk)"`
	Created        int64
	Updated        int64
	CreatedBy      *auth.User `orm:"rel(fk)"`
	UpdatedBy      *auth.User `orm:"rel(fk)"`
}

func (n *Note) TableEngine() string {
	return "InnoDB"
}
