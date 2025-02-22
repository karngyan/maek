package ysweet

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math/rand"
	"net"
	"net/http"
	"time"
)

type BodyType interface{}

type HttpClient struct {
	Token   *string
	BaseURL string
}

func NewHttpClient(baseUrl string, token *string) *HttpClient {
	return &HttpClient{
		BaseURL: baseUrl,
		Token:   token,
	}
}

func (c *HttpClient) Request(path, method string, body BodyType) (*http.Response, error) {
	headers := make(http.Header)
	if c.Token != nil {
		headers.Set("Authorization", fmt.Sprintf("Bearer %s", *c.Token))
	}

	var rawBody io.Reader
	if data, ok := body.([]byte); ok {
		headers.Set("Content-Type", "application/octet-stream")
		rawBody = io.NopCloser(bytes.NewReader(data))
	} else if body != nil {
		headers.Set("Content-Type", "application/json")
		jsonData, err := json.Marshal(body)
		if err != nil {
			return nil, err
		}
		rawBody = io.NopCloser(bytes.NewReader(jsonData))
	}

	url := fmt.Sprintf("%s/%s?z=%s", c.BaseURL, path, generateRandomString())
	req, err := http.NewRequest(method, url, rawBody)
	if err != nil {
		return nil, err
	}
	req.Header = headers

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		var netErr *net.OpError
		if errors.As(err, &netErr) {
			return nil, NewYSweetError(ErrorPayload{
				Code:    ServerRefused,
				Address: netErr.Addr.String(),
				URL:     url,
			})
		}
		return nil, NewYSweetError(ErrorPayload{Code: Unknown, Message: err.Error()})
	}

	if resp.StatusCode == http.StatusUnauthorized {
		if c.Token != nil {
			return nil, NewYSweetError(ErrorPayload{Code: InvalidAuthProvided})
		}
		return nil, NewYSweetError(ErrorPayload{Code: NoAuthProvided})
	}

	if resp.StatusCode >= 400 {
		return nil, NewYSweetError(ErrorPayload{
			Code:    ServerError,
			Status:  resp.StatusCode,
			Message: resp.Status,
			URL:     url,
		})
	}

	return resp, nil
}

func generateRandomString() string {
	rand.Seed(time.Now().UnixNano())
	letters := []rune("abcdefghijklmnopqrstuvwxyz0123456789")
	b := make([]rune, 8)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}
