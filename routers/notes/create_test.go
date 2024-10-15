package notes_test

import (
	"fmt"
	"testing"

	approvals "github.com/customerio/go-approval-tests"
	"github.com/karngyan/maek/zarf/tests"
	"github.com/stretchr/testify/assert"
)

func TestCreate(t *testing.T) {
	defer tests.CleanDBRows()

	cs := tests.NewClientStateWithUser(t)

	rr, err := cs.Post(fmt.Sprintf("/v1/workspaces/%d/notes", cs.Workspace.Id), map[string]any{
		"content": map[string]any{
			"foo": "bar",
		},
		"favorite": true,
	})

	assert.Nil(t, err)
	assert.Equal(t, 201, rr.Code)

	approvals.VerifyJSONBytes(t, rr.Body.Bytes())
}
