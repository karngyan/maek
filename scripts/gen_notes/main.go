package main

import (
	"context"
	"flag"
	"os"
	"runtime"

	"github.com/beego/beego/v2/core/logs"
	"github.com/bluele/go-timecop"
	"github.com/brianvoe/gofakeit/v7"

	"github.com/karngyan/maek/conf"
	"github.com/karngyan/maek/db"
	"github.com/karngyan/maek/domains"
	"github.com/karngyan/maek/domains/auth"
	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/routers"
)

// the script generates a bunch of notes, you give a number in and we generate a bunch of them with random data
func main() {
	n := flag.Int("n", 1, "number of notes to generate")
	w := flag.Uint64("w", 0, "workspace id")
	u := flag.Uint64("u", 0, "user id")
	flag.Parse()

	if *n < 1 {
		logs.Info("n must be greater than 0")
		os.Exit(1)
	}

	if *w <= 0 {
		logs.Info("workspace id must be greater than 0")
		os.Exit(1)
	}

	if *u <= 0 {
		logs.Info("user id must be greater than 0")
		os.Exit(1)
	}

	logs.Info("Generating %d notes ...", *n)

	Init()

	for i := 0; i < *n; i++ {
		ti := timecop.Now().Unix() - int64(gofakeit.Number(0, 10000)*60)

		n, err := notes.UpsertNoteCtx(context.Background(), &notes.UpsertNoteRequest{
			Uuid:       gofakeit.UUID(),
			Content:    "{\"dom\":[{\"children\":[],\"content\":[{\"styles\":{},\"text\":\"" + gofakeit.Sentence(6) + "\",\"type\":\"text\"}],\"id\":\"c54616f5-7b49-44ae-9051-908cf34ffc70\",\"props\":{\"backgroundColor\":\"default\",\"level\":2,\"textAlignment\":\"left\",\"textColor\":\"default\"},\"type\":\"heading\"},{\"children\":[],\"content\":[{\"styles\":{},\"text\":\"Attendees: \",\"type\":\"text\"}],\"id\":\"0ed01ac4-87a8-4a65-9dec-9456545faf84\",\"props\":{\"backgroundColor\":\"default\",\"textAlignment\":\"left\",\"textColor\":\"default\"},\"type\":\"paragraph\"},{\"children\":[],\"content\":[],\"id\":\"99e1618e-699a-400a-b0e6-4e0c4d8a53b5\",\"props\":{\"backgroundColor\":\"default\",\"textAlignment\":\"left\",\"textColor\":\"default\"},\"type\":\"paragraph\"},{\"children\":[],\"content\":[{\"styles\":{},\"text\":\"Next Steps\",\"type\":\"text\"}],\"id\":\"74ad8a46-e5aa-4f88-bc69-23dbc31def27\",\"props\":{\"backgroundColor\":\"default\",\"level\":3,\"textAlignment\":\"left\",\"textColor\":\"default\"},\"type\":\"heading\"},{\"children\":[],\"content\":[],\"id\":\"9f0cfa83-8d4e-41b2-afc6-c50ec86d7b6c\",\"props\":{\"backgroundColor\":\"default\",\"checked\":false,\"textAlignment\":\"left\",\"textColor\":\"default\"},\"type\":\"checkListItem\"},{\"children\":[],\"content\":[],\"id\":\"c98ba6ea-d368-4bba-a922-887ddf1029a9\",\"props\":{\"backgroundColor\":\"default\",\"textAlignment\":\"left\",\"textColor\":\"default\"},\"type\":\"paragraph\"},{\"children\":[],\"content\":[{\"styles\":{},\"text\":\"Agenda\",\"type\":\"text\"}],\"id\":\"374f6ce1-446b-4725-8cbd-71589dbcdde0\",\"props\":{\"backgroundColor\":\"default\",\"level\":3,\"textAlignment\":\"left\",\"textColor\":\"default\"},\"type\":\"heading\"},{\"children\":[],\"content\":[{\"styles\":{},\"text\":\"dsngkjsngjn\",\"type\":\"text\"}],\"id\":\"de2182c9-1262-4c56-ab99-311805ac9569\",\"props\":{\"backgroundColor\":\"default\",\"textAlignment\":\"left\",\"textColor\":\"default\"},\"type\":\"bulletListItem\"},{\"children\":[],\"content\":[],\"id\":\"956d84a8-d934-4b50-a794-caca25328eca\",\"props\":{\"backgroundColor\":\"default\",\"textAlignment\":\"left\",\"textColor\":\"default\"},\"type\":\"paragraph\"}]}",
			HasContent: true,
			Favorite:   false,
			Created:    ti,
			Updated:    ti,
			Workspace:  &auth.Workspace{Id: *w},
			UpdatedBy:  &auth.User{Id: *u},
			CreatedBy:  &auth.User{Id: *u},
		})
		if err != nil {
			logs.Error("Error creating note: %v", err)
			os.Exit(1)
		}

		logs.Info("Created note with id: %s", n.Uuid)
	}

	logs.Info("Done!")
}

func Init() {
	log := logs.NewLogger(10000)
	defer log.Flush()

	if err := log.SetLogger(logs.AdapterConsole, `{"level":7}`); err != nil {
		panic(err)
	}

	log.EnableFuncCallDepth(true)
	log.Async(1e3)
	log.Info("GOMAXPROCS: %d", runtime.GOMAXPROCS(0))

	if err := routers.Init(log); err != nil {
		panic(err)
	}

	if err := conf.Init(); err != nil {
		panic(err)
	}

	if err := db.Init(); err != nil {
		panic(err)
	}

	if err := domains.Init(); err != nil {
		panic(err)
	}

}
