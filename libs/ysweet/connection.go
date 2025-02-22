package ysweet

import (
	"errors"
	"fmt"
	"io"
	"net/http"
)

type DocConnection struct {
	Client *HttpClient
	DocID  string
}

func NewDocConnection(clientToken ClientToken) *DocConnection {
	baseUrl := clientToken.BaseURL
	if len(baseUrl) > 0 && baseUrl[len(baseUrl)-1] == '/' {
		baseUrl = baseUrl[:len(baseUrl)-1]
	}
	return &DocConnection{
		Client: NewHttpClient(baseUrl, clientToken.Token),
		DocID:  clientToken.DocID,
	}
}

func (dc *DocConnection) GetAsUpdate() ([]byte, error) {
	resp, err := dc.Client.Request("as-update", http.MethodGet, nil)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New(fmt.Sprintf("Failed to get doc %s: %d %s", dc.DocID, resp.StatusCode, resp.Status))
	}

	return io.ReadAll(resp.Body)
}

func (dc *DocConnection) UpdateDoc(update []byte) error {
	resp, err := dc.Client.Request("update", http.MethodPost, update)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return errors.New(fmt.Sprintf("Failed to update doc %s: %d %s", dc.DocID, resp.StatusCode, resp.Status))
	}

	return nil
}
