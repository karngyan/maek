package notes_test

import (
	"log"
	"os"
	"testing"

	"github.com/karngyan/maek/ui_api/testutil"

	approvals "github.com/approvals/go-approval-tests"
)

func TestMain(m *testing.M) {
	testutil.FreezeTime()
	os.Exit(runTests(m))
}

func runTests(m *testing.M) int {
	testApp, err := testutil.StartTestApp()
	if err != nil {
		log.Println("Error initializing test app: ", err)
		return 1
	}
	defer func() {
		if err := testApp.Stop(); err != nil {
			log.Println("Error stopping test app: ", err)
		}
	}()

	approvals.UseFolder("./testdata")

	return m.Run()
}
