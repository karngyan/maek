package collections_test

import (
	"context"
	"encoding/json"
	"fmt"
	"testing"
	"time"

	approvals "github.com/approvals/go-approval-tests"

	"github.com/karngyan/maek/domains/notes"

	"github.com/karngyan/maek/domains/collections"
	"github.com/karngyan/maek/ui_api/testutil"
	"github.com/stretchr/testify/assert"
)

func TestAddNotes(t *testing.T) {
	defer testutil.TruncateTables()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cs := testutil.NewClientStateWithUser(t)

	c, err := collections.CreateCollection(ctx, cs.Workspace.ID, cs.User.ID)
	assert.NoError(t, err)

	cbytes, err := json.Marshal(map[string]any{
		"dom": []any{},
	})

	n1, err := notes.UpsertNote(ctx, &notes.UpsertNoteRequest{
		UUID:        "uuid-1",
		Content:     cbytes,
		Created:     12345,
		Updated:     12345,
		WorkspaceID: cs.Workspace.ID,
		CreatedByID: cs.User.ID,
		UpdatedByID: cs.User.ID,
	})
	assert.NoError(t, err)

	n2, err := notes.UpsertNote(ctx, &notes.UpsertNoteRequest{
		UUID:        "uuid-2",
		Content:     cbytes,
		Created:     12345,
		Updated:     12345,
		WorkspaceID: cs.Workspace.ID,
		CreatedByID: cs.User.ID,
		UpdatedByID: cs.User.ID,
	})
	assert.NoError(t, err)

	rr, err := cs.Post(fmt.Sprintf("/v1/workspaces/%d/collections/%d/notes", c.WorkspaceID, c.ID), map[string]any{
		"noteIds": []int64{n1.ID, n2.ID},
	})
	assert.NoError(t, err)
	assert.Equal(t, 200, rr.Code)

	approvals.VerifyJSONBytes(t, rr.Body.Bytes())
}
