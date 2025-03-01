package notes_test

import (
	"fmt"
	"testing"

	approvals "github.com/approvals/go-approval-tests"
	"github.com/stretchr/testify/assert"

	"github.com/karngyan/maek/ui_api/testutil"
)

func TestUpsert(t *testing.T) {
	defer testutil.TruncateTables()

	cs := testutil.NewClientStateWithUser(t)

	var testCases = []struct {
		name           string
		uuid           string
		updates        map[string]any
		expectedStatus int
	}{
		{
			name: "valid note first time",
			uuid: "123",
			updates: map[string]any{
				"content": map[string]any{
					"dom": "some text",
				},
				"created":        1234567890,
				"updated":        1234567890,
				"hasContent":     true,
				"hasImages":      true,
				"hasVideos":      true,
				"hasOpenTasks":   true,
				"hasClosedTasks": true,
				"hasCode":        true,
				"hasLinks":       true,
				"hasFiles":       true,
				"hasQuotes":      true,
				"hasAudios":      true,
				"hasTables":      true,
			},
			expectedStatus: 200,
		},
		{
			name: "update created note",
			uuid: "123",
			updates: map[string]any{
				"content": map[string]any{
					"dom": "updated stuff",
				},
				"created": 1234567890,
				"updated": 9999999999,
			},
			expectedStatus: 200,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			rr, err := cs.Put(fmt.Sprintf("/v1/workspaces/%d/notes/%s", cs.Workspace.ID, tc.uuid), tc.updates)

			assert.Nil(t, err)
			assert.Equal(t, tc.expectedStatus, rr.Code)

			// do an individual get call to verify the upsert
			rr, err = cs.Get(fmt.Sprintf("/v1/workspaces/%d/notes/%s", cs.Workspace.ID, tc.uuid))
			assert.Nil(t, err)
			assert.Equal(t, 200, rr.Code)

			approvals.VerifyJSONBytes(t, rr.Body.Bytes())
		})
	}
}
