package main

import (
  "net/http"
  "time"

  "github.com/karngyan/maek/conf"
  "github.com/karngyan/maek/routers"

  "github.com/beego/beego/v2/server/web"
  "github.com/beego/beego/v2/server/web/filter/cors"
)

func main() {

  web.AddAPPStartHook(
    routers.Init,
    conf.Init,
    // db.Init,
    // models.Init,
  )

  allowedOrigins := conf.CorsAllowedOrigins
  if conf.IsDevEnv() {
    allowedOrigins = []string{"localhost"}
  }

  web.InsertFilter("*", web.BeforeRouter, cors.Allow(&cors.Options{
    AllowOrigins:     allowedOrigins,
    AllowCredentials: true,
    MaxAge:           24 * time.Hour,
    AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions, http.MethodPatch},
    AllowHeaders:     []string{"Content-Type", "Authorization", "Origin"},
    ExposeHeaders:    []string{"Content-Length"},
  }), web.WithReturnOnOutput(false))

  web.Run("localhost")
}
