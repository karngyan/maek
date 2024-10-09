package auth_test

import (
	"testing"

	approvals "github.com/customerio/go-approval-tests"
	"github.com/karngyan/maek/libs/randstr"
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

func TestRegisterErrors(t *testing.T) {
	type testCase struct {
		name         string
		body         map[string]any
		expectedCode int
	}

	tcs := []testCase{
		{
			name: "Invalid email",
			body: map[string]any{
				"name":     "Karn",
				"email":    "wrong-email",
				"password": "test-password",
			},
			expectedCode: 400,
		},
		{
			name: "too short password",
			body: map[string]any{
				"email":    "karn@maek.ai",
				"password": "test",
			},
			expectedCode: 400,
		},
		{
			name: "too long password",
			body: map[string]any{
				"email":    "karn@maek.ai",
				"password": randstr.Base64(65),
			},
			expectedCode: 400,
		},
		{
			name: "too long name",
			body: map[string]any{
				"name":     randstr.Base64(201),
				"email":    "karn@maek.ai",
				"password": "test-password",
			},
			expectedCode: 400,
		},
	}

	for _, tt := range tcs {
		t.Run(tt.name, func(t *testing.T) {
			rr, err := tests.Post("/v1/auth/register", tt.body)
			assert.Nil(t, err)
			assert.Equal(t, tt.expectedCode, rr.Code)
			approvals.VerifyJSONBytes(t, rr.Body.Bytes())
		})
	}
}
