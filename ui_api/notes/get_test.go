package notes_test

import (
	"context"
	"encoding/json"
	"fmt"
	"testing"

	approvals "github.com/approvals/go-approval-tests"
	"github.com/bluele/go-timecop"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/ui_api/testutil"
	"github.com/stretchr/testify/assert"
)

func TestGet(t *testing.T) {
	defer testutil.TruncateTables()

	cs := testutil.NewClientStateWithUser(t)
	cs2 := testutil.NewClientStateWithUserEmail(t, "john@maek.ai")

	cbytes, err := json.Marshal(map[string]any{
		"dom": []any{},
	})
	assert.Nil(t, err)

	n, err := notes.UpsertNote(context.Background(), &notes.UpsertNoteRequest{
		UUID:        "123",
		Content:     cbytes,
		Created:     timecop.Now().Unix(),
		Updated:     timecop.Now().Unix(),
		WorkspaceID: cs.Workspace.ID,
		CreatedByID: cs.User.ID,
		UpdatedByID: cs.User.ID,
	})
	assert.Nil(t, err)

	n2, err := notes.UpsertNote(context.Background(), &notes.UpsertNoteRequest{
		UUID:        "321",
		Content:     cbytes,
		Created:     timecop.Now().Unix(),
		Updated:     timecop.Now().Unix(),
		WorkspaceID: cs2.Workspace.ID,
		CreatedByID: cs2.User.ID,
		UpdatedByID: cs2.User.ID,
	})

	assert.Nil(t, err)

	var testCases = []struct {
		name           string
		uuid           string
		workspaceId    int64
		expectedStatus int
	}{
		{
			name:           "valid note id",
			uuid:           n.UUID,
			workspaceId:    cs.Workspace.ID,
			expectedStatus: 200,
		},
		{
			name:           "invalid note id",
			uuid:           "random-note-uuid",
			workspaceId:    cs.Workspace.ID,
			expectedStatus: 404,
		},
		{
			name:           "note id from different workspace",
			uuid:           n2.UUID,
			workspaceId:    cs.Workspace.ID,
			expectedStatus: 404,
		},
		{
			name:           "session token used from another user to fetch note",
			uuid:           n2.UUID,
			workspaceId:    cs2.Workspace.ID,
			expectedStatus: 401,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			rr, err := cs.Get(fmt.Sprintf("/v1/workspaces/%d/notes/%s", tc.workspaceId, tc.uuid))
			assert.Nil(t, err)
			assert.Equal(t, tc.expectedStatus, rr.Code)

			approvals.VerifyJSONBytes(t, rr.Body.Bytes())
		})
	}
}
