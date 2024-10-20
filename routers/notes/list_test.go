package notes_test

import (
	"context"
	"fmt"
	"testing"

	approvals "github.com/customerio/go-approval-tests"
	"github.com/stretchr/testify/assert"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/zarf/tests"
)

func TestList(t *testing.T) {
	defer tests.CleanDBRows()

	cs := tests.NewClientStateWithUser(t)

	_, err := notes.UpsertNoteCtx(context.Background(), &notes.UpsertNoteRequest{
		Uuid:      "123",
		Content:   "{ \"foo\": \"bar\" }",
		Favorite:  true,
		Created:   1234567890,
		Updated:   1234567890,
		Workspace: cs.Workspace,
		CreatedBy: cs.User,
		UpdatedBy: cs.User,
	})

	assert.Nil(t, err)

	rr, err := cs.Get(fmt.Sprintf("/v1/workspaces/%d/notes", cs.Workspace.Id))
	assert.Nil(t, err)
	assert.Equal(t, 200, rr.Code)

	approvals.VerifyJSONBytes(t, rr.Body.Bytes())
}
