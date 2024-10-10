package auth_test

import (
	"os"
	"testing"

	approvals "github.com/customerio/go-approval-tests"

	"github.com/karngyan/maek/zarf/tests"
)

func TestMain(m *testing.M) {
	tests.FreezeTime()

	if err := tests.InitApp(); err != nil {
		os.Exit(1)
	}

	approvals.UseFolder("./testdata")

	if code := m.Run(); code != 0 {
		os.Exit(code)
	}
}
