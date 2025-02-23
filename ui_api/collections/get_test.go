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

func TestGet(t *testing.T) {
	defer testutil.TruncateTables()

	cs := testutil.NewClientStateWithUser(t)
	cs2 := testutil.NewClientStateWithUserEmail(t, "john@maek.ai")

	n, err := collections.CreateCollection(context.Background(), cs.Workspace.ID, cs.User.ID, "")
	assert.Nil(t, err)

	n2, err := collections.CreateCollection(context.Background(), cs2.Workspace.ID, cs2.User.ID, "")

	assert.Nil(t, err)

	var testCases = []struct {
		name           string
		id             int64
		workspaceId    int64
		expectedStatus int
	}{
		{
			name:           "valid collection id",
			id:             n.ID,
			workspaceId:    cs.Workspace.ID,
			expectedStatus: 200,
		},
		{
			name:           "invalid collection id",
			id:             -1,
			workspaceId:    cs.Workspace.ID,
			expectedStatus: 400,
		},
		{
			name:           "not found collection id",
			id:             5,
			workspaceId:    cs.Workspace.ID,
			expectedStatus: 404,
		},
		{
			name:           "collection id from different workspace",
			id:             n2.ID,
			workspaceId:    cs.Workspace.ID,
			expectedStatus: 404,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			rr, err := cs.Get(fmt.Sprintf("/v1/workspaces/%d/collections/%d", tc.workspaceId, tc.id))
			assert.Nil(t, err)
			assert.Equal(t, tc.expectedStatus, rr.Code)

			approvals.VerifyJSONBytes(t, rr.Body.Bytes())
		})
	}
}
