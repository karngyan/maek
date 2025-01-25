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

func TestList(t *testing.T) {
	defer testutil.TruncateTables()

	cs := testutil.NewClientStateWithUser(t)

	i := 1
	for i < 10 {
		c, err := collections.CreateCollection(context.Background(), cs.Workspace.ID, cs.User.ID, "")
		assert.NoError(t, err)
		_, err = collections.UpdateCollection(context.Background(), &collections.UpdateCollectionRequest{
			ID:          c.ID,
			Name:        fmt.Sprintf("Name %d", i),
			Description: fmt.Sprintf("Description %d", i),
			WorkspaceID: cs.Workspace.ID,
			UpdatedByID: cs.User.ID,
		})
		assert.NoError(t, err)
		i += 1
	}

	var tests = []struct {
		name               string
		sort               string
		cursor             string
		limit              string
		expectedStatusCode int
	}{
		{
			name:               "should return 200 with default limit",
			cursor:             "",
			limit:              "",
			expectedStatusCode: 200,
		},
		{
			name:               "should return 200 with custom limit",
			cursor:             "",
			sort:               "name_asc",
			limit:              "5",
			expectedStatusCode: 200,
		},
		{
			name:               "should return 400 with limit too high",
			cursor:             "",
			limit:              "1000",
			expectedStatusCode: 400,
		},
		{
			name:               "should return 200 with cursor",
			cursor:             "TmFtZSA1OjU=", // base64 encoded "Name 5:5"
			sort:               "name_asc",
			limit:              "5",
			expectedStatusCode: 200,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			rr, err := cs.Get(fmt.Sprintf("/v1/workspaces/%d/collections?limit=%s&cursor=%s&sort=%s", cs.Workspace.ID, tc.limit, tc.cursor, tc.sort))

			assert.Nil(t, err)
			assert.Equal(t, tc.expectedStatusCode, rr.Code)

			approvals.VerifyJSONBytes(t, rr.Body.Bytes())
		})
	}
}
