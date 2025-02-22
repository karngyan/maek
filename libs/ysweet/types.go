package ysweet

type DocCreationResult struct {
	DocID string `json:"docId"`
}

type Authorization string

const (
	FullAuthorization     Authorization = "full"
	ReadOnlyAuthorization Authorization = "read-only"
)

type ClientToken struct {
	URL           string         `json:"url"`
	BaseURL       string         `json:"baseUrl"`
	DocID         string         `json:"docId"`
	Token         *string        `json:"token,omitempty"`
	Authorization *Authorization `json:"authorization,omitempty"`
}

type CheckStoreResult struct {
	OK    bool   `json:"ok"`
	Error string `json:"error,omitempty"`
}

type AuthDocRequest struct {
	Authorization   *Authorization `json:"authorization,omitempty"`
	UserID          *string        `json:"userId,omitempty"`
	ValidForSeconds *int           `json:"validForSeconds,omitempty"`
	InitialContent  *string        `json:"initialContent,omitempty"`
}
