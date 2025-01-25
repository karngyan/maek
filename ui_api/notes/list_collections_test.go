package notes_test

import (
	"context"
	"encoding/json"
	"fmt"
	"testing"
	"time"

	approvals "github.com/approvals/go-approval-tests"
	"github.com/bluele/go-timecop"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/karngyan/maek/domains/collections"
	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/ui_api/testutil"
)

func TestListCollectionsForNote(t *testing.T) {
	defer testutil.TruncateTables()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cs := testutil.NewClientStateWithUser(t)
	cbytes, err := json.Marshal(map[string]any{
		"dom": []any{},
	})
	require.NoError(t, err)

	n, err := notes.UpsertNote(ctx, &notes.UpsertNoteRequest{
		UUID:        "123",
		Content:     cbytes,
		Favorite:    true,
		Created:     timecop.Now().Unix(),
		Updated:     timecop.Now().Unix(),
		WorkspaceID: cs.Workspace.ID,
		CreatedByID: cs.User.ID,
		UpdatedByID: cs.User.ID,
	})
	require.NoError(t, err)

	c, err := collections.CreateCollection(ctx, cs.Workspace.ID, cs.User.ID)
	require.NoError(t, err)

	c, err = collections.UpdateCollection(ctx, &collections.UpdateCollectionRequest{
		ID:          c.ID,
		Name:        "test collection name",
		WorkspaceID: cs.Workspace.ID,
		UpdatedByID: cs.User.ID,
	})
	require.NoError(t, err)

	c, err = collections.AddNotesToCollection(ctx, cs.Workspace.ID, c.ID, []int64{n.ID})
	require.NoError(t, err)

	rr, err := cs.Get(fmt.Sprintf("/v1/workspaces/%d/notes/%s/collections", cs.Workspace.ID, n.UUID))
	require.NoError(t, err)
	assert.Equal(t, 200, rr.Code)

	approvals.VerifyJSONBytes(t, rr.Body.Bytes())
}
