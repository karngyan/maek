package collections_test

import (
	"fmt"
	"testing"

	approvals "github.com/approvals/go-approval-tests"
	"github.com/karngyan/maek/ui_api/testutil"
	"github.com/stretchr/testify/assert"
)

func TestCreate(t *testing.T) {
	defer testutil.TruncateTables()
	cs := testutil.NewClientStateWithUser(t)

	rr, err := cs.Post(fmt.Sprintf("/v1/workspaces/%d/collections", cs.Workspace.ID), nil)
	assert.Nil(t, err)
	assert.Equal(t, 201, rr.Code)

	approvals.VerifyJSONBytes(t, rr.Body.Bytes())
}
