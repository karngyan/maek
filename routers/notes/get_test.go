package notes_test

import (
	"context"
	"fmt"
	"testing"

	approvals "github.com/customerio/go-approval-tests"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/zarf/tests"
	"github.com/stretchr/testify/assert"
)

func TestGet(t *testing.T) {
	defer tests.CleanDBRows()

	cs := tests.NewClientStateWithUser(t)
	cs2 := tests.NewClientStateWithUserEmail(t, "john@maek.ai")

	n, err := notes.UpsertNoteCtx(context.Background(), notes.WithUuid("123"), notes.WithContent("{ \"dom\": [] }"), notes.WithWorkspace(cs.Workspace), notes.WithUpdatedBy(cs.User), notes.WithFavorite(true))
	assert.Nil(t, err)

	n2, err := notes.UpsertNoteCtx(context.Background(), notes.WithUuid("321"), notes.WithContent("{ \"dom\": [] }"), notes.WithWorkspace(cs2.Workspace), notes.WithUpdatedBy(cs2.User), notes.WithFavorite(true))
	assert.Nil(t, err)

	var testCases = []struct {
		name           string
		noteId         string
		workspaceId    uint64
		expectedStatus int
	}{
		{
			name:           "valid note id",
			noteId:         n.Uuid,
			workspaceId:    cs.Workspace.Id,
			expectedStatus: 200,
		},
		{
			name:           "invalid note id",
			noteId:         "random-note-uuid",
			workspaceId:    cs.Workspace.Id,
			expectedStatus: 404,
		},
		{
			name:           "note id from different workspace",
			noteId:         n2.Uuid,
			workspaceId:    cs.Workspace.Id,
			expectedStatus: 404,
		},
		{
			name:           "session token used from another user to fetch note",
			noteId:         n2.Uuid,
			workspaceId:    cs2.Workspace.Id,
			expectedStatus: 401,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			rr, err := cs.Get(fmt.Sprintf("/v1/workspaces/%d/notes/%s", tc.workspaceId, tc.noteId))
			assert.Nil(t, err)
			assert.Equal(t, tc.expectedStatus, rr.Code)

			approvals.VerifyJSONBytes(t, rr.Body.Bytes())
		})
	}
}
