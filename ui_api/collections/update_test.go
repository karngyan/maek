package collections_test

import (
	"context"
	"fmt"
	"testing"

	approvals "github.com/approvals/go-approval-tests"
	"github.com/karngyan/maek/domains/collections"
	"github.com/karngyan/maek/ui_api/testutil"
	"github.com/stretchr/testify/assert"
)

func TestUpdate(t *testing.T) {
	defer testutil.TruncateTables()
	cs := testutil.NewClientStateWithUser(t)

	c, err := collections.CreateCollection(context.Background(), cs.Workspace.ID, cs.User.ID)
	assert.NoError(t, err)

	rr, err := cs.Put(fmt.Sprintf("/v1/workspaces/%d/collections/%d", cs.Workspace.ID, c.ID), map[string]any{
		"name":        "Updated Name",
		"description": "Updated Description",
	})
	assert.Nil(t, err)

	assert.Equal(t, 200, rr.Code)
	approvals.VerifyJSONBytes(t, rr.Body.Bytes())
}
