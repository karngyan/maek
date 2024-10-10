package auth_test

import (
	"testing"

	approvals "github.com/customerio/go-approval-tests"

	"github.com/karngyan/maek/zarf/tests"
	"github.com/stretchr/testify/assert"
)

func TestLogin(t *testing.T) {
	defer tests.CleanDBRows()

	cs := tests.NewClientStateWithUser(t)
	rr, err := cs.Post("/v1/auth/login", map[string]any{
		"email":    "karn@maek.ai",
		"password": "test-password",
	})
	assert.Nil(t, err)
	assert.Equal(t, 200, rr.Code)

	approvals.VerifyJSONBytes(t, rr.Body.Bytes())
	assert.Contains(t, rr.Header().Get("Set-Cookie"), "HttpOnly; Secure; SameSite=Strict")
}

func TestLoginErrors(t *testing.T) {
	defer tests.CleanDBRows()
	cs := tests.NewClientState()

	type testCase struct {
		name         string
		body         map[string]any
		expectedCode int
	}

	tcs := []testCase{
		{
			name: "Invalid email",
			body: map[string]any{
				"email":    "wrong-email",
				"password": "test-password",
			},
			expectedCode: 400,
		},
		{
			name: "Invalid password",
			body: map[string]any{
				"email":    "karn@maek.ai",
				"password": "wrong-password",
			},
			expectedCode: 400,
		},
	}

	for _, tc := range tcs {
		t.Run(tc.name, func(t *testing.T) {
			rr, err := cs.Post("/v1/auth/login", tc.body)
			assert.Nil(t, err)
			assert.Equal(t, tc.expectedCode, rr.Code)
			approvals.VerifyJSONBytes(t, rr.Body.Bytes())
		})
	}
}
