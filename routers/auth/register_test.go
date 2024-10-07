package auth_test

import (
	"testing"

	approvals "github.com/customerio/go-approval-tests"

	"github.com/karngyan/maek/zarf/tests"
	"github.com/stretchr/testify/assert"
)

func TestRegister(t *testing.T) {
	rr, err := tests.Post("/v1/auth/register", map[string]any{
		"name":     "Karn",
		"email":    "karn@maek.ai",
		"password": "test-password",
	})

	assert.Nil(t, err)
	assert.Equal(t, 201, rr.Code)

	approvals.VerifyJSONBytes(t, rr.Body.Bytes())
	assert.Contains(t, rr.Header().Get("Set-Cookie"), "HttpOnly; Secure; SameSite=Strict")
}
