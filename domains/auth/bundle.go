package auth

type Bundle struct {
	User       *User
	Session    *Session
	Workspaces []*Workspace
}
