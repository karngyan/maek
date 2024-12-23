package auth_test

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/karngyan/maek/domains/auth"
	"github.com/karngyan/maek/ui_api/testutil"
)

func TestLogout(t *testing.T) {
	defer testutil.TruncateTables()

	cs := testutil.NewClientStateWithUser(t)
	sessionToken := cs.Session.Token

	rr, err := cs.Get("/v1/auth/logout")
	assert.Nil(t, err)
	assert.Equal(t, 200, rr.Code)

	_, err = auth.FetchSessionByToken(context.Background(), sessionToken)
	assert.True(t, errors.Is(err, auth.ErrSessionNotFound))
}
