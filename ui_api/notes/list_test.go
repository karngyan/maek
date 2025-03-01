package notes_test

import (
	"context"
	"encoding/json"
	"fmt"
	"testing"

	approvals "github.com/approvals/go-approval-tests"
	"github.com/stretchr/testify/assert"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/ui_api/testutil"
)

func TestList(t *testing.T) {
	defer testutil.TruncateTables()

	cs := testutil.NewClientStateWithUser(t)

	cbytes, err := json.Marshal(map[string]any{
		"dom": []any{},
	})
	assert.Nil(t, err)

	i := 1
	for i < 10 {
		_, err := notes.UpsertNote(context.Background(), &notes.UpsertNoteRequest{
			UUID:        fmt.Sprintf("rand-uuid-%d", i),
			Content:     cbytes,
			Created:     int64(i),
			Updated:     int64(2 * i),
			WorkspaceID: cs.Workspace.ID,
			CreatedByID: cs.User.ID,
			UpdatedByID: cs.User.ID,
			HasContent:  true,
		})
		assert.Nil(t, err)

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
			cursor:             "MTA6NQ==", // base64 encoded 10:5
			limit:              "",
			expectedStatusCode: 200,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rr, err := cs.Get(fmt.Sprintf("/v1/workspaces/%d/notes?limit=%s&cursor=%s&sort=%s", cs.Workspace.ID, tt.limit, tt.cursor, tt.sort))

			assert.Nil(t, err)
			assert.Equal(t, tt.expectedStatusCode, rr.Code)

			approvals.VerifyJSONBytes(t, rr.Body.Bytes())
		})
	}
}
