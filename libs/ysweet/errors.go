package ysweet

import (
	"fmt"
	"regexp"
	"strconv"
)

type ErrorCode string

const (
	ServerRefused       ErrorCode = "ServerRefused"
	ServerError         ErrorCode = "ServerError"
	NoAuthProvided      ErrorCode = "NoAuthProvided"
	InvalidAuthProvided ErrorCode = "InvalidAuthProvided"
	Unknown             ErrorCode = "Unknown"
)

type ErrorPayload struct {
	Code    ErrorCode `json:"code"`
	Address string    `json:"address,omitempty"`
	Port    int       `json:"port,omitempty"`
	URL     string    `json:"url,omitempty"`
	Status  int       `json:"status,omitempty"`
	Message string    `json:"message,omitempty"`
}

type Error struct {
	Cause ErrorPayload
}

func (e *Error) Error() string {
	return e.GetMessage()
}

func NewYSweetError(cause ErrorPayload) *Error {
	return &Error{Cause: cause}
}

func (e *Error) GetMessage() string {
	switch e.Cause.Code {
	case ServerRefused:
		return fmt.Sprintf("%s: Server at %s:%d refused connection. URL: %s", e.Cause.Code, e.Cause.Address, e.Cause.Port, e.Cause.URL)
	case ServerError:
		return fmt.Sprintf("%s: Server responded with %d %s. URL: %s", e.Cause.Code, e.Cause.Status, e.Cause.Message, e.Cause.URL)
	case NoAuthProvided:
		return "No auth provided"
	case InvalidAuthProvided:
		return "Invalid auth provided"
	default:
		return fmt.Sprintf("%s: %s", e.Cause.Code, e.Cause.Message)
	}
}

func ErrorFromMessage(messageString string) *Error {
	match := regexp.MustCompile(`^(.*?): (.*)$`).FindStringSubmatch(messageString)
	if len(match) != 3 {
		return NewYSweetError(ErrorPayload{Code: Unknown, Message: messageString})
	}

	code := match[1]
	message := match[2]

	switch code {
	case string(ServerRefused):
		match = regexp.MustCompile(`^Server at (.*?):(\d+) refused connection. URL: (.*)$`).FindStringSubmatch(message)
		if len(match) != 4 {
			return NewYSweetError(ErrorPayload{Code: Unknown, Message: messageString})
		}
		port, _ := strconv.Atoi(match[2])
		return NewYSweetError(ErrorPayload{Code: ServerRefused, Address: match[1], Port: port, URL: match[3]})

	case string(ServerError):
		match = regexp.MustCompile(`^Server responded with (\d+) (.*). URL: (.*)$`).FindStringSubmatch(message)
		if len(match) != 4 {
			return NewYSweetError(ErrorPayload{Code: Unknown, Message: messageString})
		}
		status, _ := strconv.Atoi(match[1])
		return NewYSweetError(ErrorPayload{Code: ServerError, Status: status, Message: match[2], URL: match[3]})

	case string(NoAuthProvided):
		return NewYSweetError(ErrorPayload{Code: NoAuthProvided})

	case string(InvalidAuthProvided):
		return NewYSweetError(ErrorPayload{Code: InvalidAuthProvided})

	default:
		return NewYSweetError(ErrorPayload{Code: Unknown, Message: message})
	}
}
