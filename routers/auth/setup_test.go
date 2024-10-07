package auth_test

import (
	"os"
	"testing"

	"github.com/bluele/go-timecop"

	approvals "github.com/customerio/go-approval-tests"

	"github.com/karngyan/maek/zarf/tests"
)

func TestMain(m *testing.M) {
	timecop.Freeze(tests.FrozenTime)

	if err := tests.InitApp(); err != nil {
		os.Exit(1)
	}

	defer tests.CleanUp()

	approvals.UseFolder("./testdata")

	if code := m.Run(); code != 0 {
		os.Exit(code)
	}
}
