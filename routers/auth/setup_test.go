package auth_test

import (
	"os"
	"testing"

	approvals "github.com/approvals/go-approval-tests"

	"github.com/karngyan/maek/zarf/tests"
)

func TestMain(m *testing.M) {
	tests.FreezeTime()
	os.Exit(runTests(m))
}

func runTests(m *testing.M) int {
	cleanup, err := tests.InitApp()
	if err != nil {
		cleanup()
		return 1
	}
	defer cleanup()

	approvals.UseFolder("./testdata")

	return m.Run()
}
