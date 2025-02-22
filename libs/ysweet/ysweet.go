package ysweet

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
)

type DocumentManager struct {
	Client *HttpClient
}

func NewDocumentManager(connectionString string) (*DocumentManager, error) {
	parsedUrl, err := url.Parse(connectionString)
	if err != nil {
		return nil, err
	}

	var token *string
	if parsedUrl.User != nil {
		t := parsedUrl.User.Username()
		tDecoded, err := url.QueryUnescape(t)
		if err != nil {
			return nil, err
		}
		token = &tDecoded
	}

	protocol := parsedUrl.Scheme
	if protocol == "ys" {
		protocol = "http"
	} else if protocol == "yss" {
		protocol = "https"
	}

	baseUrl := fmt.Sprintf("%s://%s%s", protocol, parsedUrl.Host, parsedUrl.Path)
	baseUrl = strings.TrimSuffix(baseUrl, "/")

	return &DocumentManager{
		Client: NewHttpClient(baseUrl, token),
	}, nil
}

func (dm *DocumentManager) CheckStore() (CheckStoreResult, error) {
	resp, err := dm.Client.Request("check_store", "POST", nil)
	if err != nil {
		return CheckStoreResult{}, err
	}
	defer resp.Body.Close()

	var result CheckStoreResult
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return CheckStoreResult{}, err
	}
	return result, nil
}

func (dm *DocumentManager) CreateDoc(docId *string) (DocCreationResult, error) {
	body := map[string]interface{}{}
	if docId != nil {
		body["docId"] = *docId
	}

	resp, err := dm.Client.Request("doc/new", "POST", body)
	if err != nil {
		return DocCreationResult{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return DocCreationResult{}, fmt.Errorf("failed to create doc: %d %s", resp.StatusCode, resp.Status)
	}

	var result DocCreationResult
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return DocCreationResult{}, err
	}
	return result, nil
}

func (dm *DocumentManager) GetClientToken(docId string, authDocRequest *AuthDocRequest) (ClientToken, error) {
	resp, err := dm.Client.Request(fmt.Sprintf("doc/%s/auth", docId), "POST", authDocRequest)
	if err != nil {
		return ClientToken{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return ClientToken{}, fmt.Errorf("failed to auth doc %s: %d %s", docId, resp.StatusCode, resp.Status)
	}

	var result ClientToken
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return ClientToken{}, err
	}
	return result, nil
}

func (dm *DocumentManager) GetOrCreateDocAndToken(docId *string, authDocRequest *AuthDocRequest) (ClientToken, error) {
	result, err := dm.CreateDoc(docId)
	if err != nil {
		return ClientToken{}, err
	}
	return dm.GetClientToken(result.DocID, authDocRequest)
}

func (dm *DocumentManager) GetDocAsUpdate(docId string) ([]byte, error) {
	connection, err := dm.GetDocConnection(docId, nil)
	if err != nil {
		return nil, err
	}
	return connection.GetAsUpdate()
}

func (dm *DocumentManager) UpdateDoc(docId string, update []byte) error {
	connection, err := dm.GetDocConnection(docId, nil)
	if err != nil {
		return err
	}
	return connection.UpdateDoc(update)
}

func (dm *DocumentManager) GetDocConnection(docId string, authDocRequest *AuthDocRequest) (*DocConnection, error) {
	clientToken, err := dm.GetClientToken(docId, authDocRequest)
	if err != nil {
		return nil, err
	}
	return NewDocConnection(clientToken), nil
}

func (dm *DocumentManager) CreateDocWithContent(docId *string, update []byte) (DocCreationResult, error) {
	result, err := dm.CreateDoc(docId)
	if err != nil {
		return DocCreationResult{}, err
	}
	if err := dm.UpdateDoc(result.DocID, update); err != nil {
		return DocCreationResult{}, err
	}
	return result, nil
}
