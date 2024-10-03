package main

import (
  "net/http"
  "time"

  "github.com/beego/beego/v2/server/web"
  "github.com/beego/beego/v2/server/web/filter/cors"

  "github.com/karngyan/maek/conf"
  "github.com/karngyan/maek/db"
  "github.com/karngyan/maek/models"
  "github.com/karngyan/maek/routers"
)

func main() {

  web.AddAPPStartHook(
    routers.Init,
    conf.Init,
    db.Init,
    models.Init,
    db.InitOrmer,
  )

  web.InsertFilter("*", web.BeforeRouter, cors.Allow(&cors.Options{
    AllowOrigins:     conf.CorsAllowedOrigins,
    AllowCredentials: true,
    MaxAge:           24 * time.Hour,
    AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions, http.MethodPatch},
    AllowHeaders:     []string{"Content-Type", "Authorization", "Origin"},
    ExposeHeaders:    []string{"Content-Length"},
  }), web.WithReturnOnOutput(false))

  web.Run("localhost")
}
