package base

type Response struct {
	Data  any            `json:"data"`
	Error *ResponseError `json:"error"`
	Meta  *ResponseMeta  `json:"meta"`
}

type ErrorType string

const (
	ResponseErrorWarning ErrorType = "warning"
	ResponseErrorDanger  ErrorType = "error"
	ResponseErrorInfo    ErrorType = "info"
)

type ResponseError struct {
	Title  string    `json:"title"`
	Detail string    `json:"detail"`
	Type   ErrorType `json:"type"`
}

type ResponseMeta struct {
	Pagination *PaginationMeta `json:"pagination"`
	// add more as required
}

// PaginationMeta is page number, per page and total count
// TODO: consider token based pagination
type PaginationMeta struct {
	Page    int64 `json:"page"`
	PerPage int64 `json:"per_page"`
	Total   int64 `json:"total"`
}
