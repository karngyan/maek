package main

import (
	"context"
	"net/http"
	"runtime"
	"time"

	"github.com/beego/beego/v2/core/logs"
	"github.com/beego/beego/v2/server/web"
	"github.com/beego/beego/v2/server/web/filter/cors"

	"github.com/karngyan/maek/conf"
	"github.com/karngyan/maek/db"
	"github.com/karngyan/maek/domains"
	"github.com/karngyan/maek/routers"
)

func main() {
	ctx := context.Background()

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

	if err := db.Init(ctx); err != nil {
		panic(err)
	}
	defer db.Close()

	if err := domains.Init(); err != nil {
		panic(err)
	}

	web.InsertFilter("*", web.BeforeRouter, cors.Allow(&cors.Options{
		AllowOrigins:     conf.CorsAllowedOrigins,
		AllowCredentials: true,
		MaxAge:           24 * time.Hour,
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions, http.MethodPatch},
		AllowHeaders:     []string{"Content-Type", "Authorization", "Origin"},
		ExposeHeaders:    []string{"Content-Length"},
	}), web.WithReturnOnOutput(false))

	web.Run("0.0.0.0")
}
