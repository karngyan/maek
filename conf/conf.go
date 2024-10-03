package conf

import (
  "fmt"
  "runtime"
  "time"

  "github.com/beego/beego/v2/server/web"
)

// NoStatus is a placeholder when there's no valid HTTP status
// to return with a request
const NoStatus = -1

// DefaultRequestTimeout is the maximum TTL for individual requests
const DefaultRequestTimeout = 10 * time.Second

// DefaultMaxRead sets a cap on how much data we will read from an individual response
const DefaultMaxRead = 1024 * 1024 // 1MB

var (
  MysqlHost          string
  MysqlPort          string
  MysqlSchema        string
  MysqlUser          string
  MysqlPassword      string
  SQLConn            string
  Domain             string
  CorsAllowedOrigins []string
)

func IsDevEnv() bool {
  return web.BConfig.RunMode == "dev"
}

func IsProdEnv() bool {
  return web.BConfig.RunMode == "prod"
}

func Init() error {

  var err error

  web.BConfig.Listen = web.Listen{
    Graceful:      true,
    EnableHTTP:    true,
    EnableAdmin:   true,
    ServerTimeOut: 30, // seconds
    HTTPAddr:      web.BConfig.Listen.HTTPAddr,
    HTTPPort:      web.BConfig.Listen.HTTPPort,
    AdminAddr:     web.BConfig.Listen.AdminAddr,
    AdminPort:     web.BConfig.Listen.AdminPort,
  }

  if MysqlHost, err = web.AppConfig.String("MysqlHost"); err != nil {
    return err
  }

  if MysqlPort, err = web.AppConfig.String("MysqlPort"); err != nil {
    return err
  }

  if MysqlSchema, err = web.AppConfig.String("MysqlSchema"); err != nil {
    return err
  }

  if MysqlUser, err = web.AppConfig.String("MysqlUser"); err != nil {
    return err
  }

  if MysqlPassword, err = web.AppConfig.String("MysqlPassword"); err != nil {
    return err
  }

  SQLConn = fmt.Sprintf("%v:%v@tcp(%v:%v)/%v?charset=utf8", MysqlUser, MysqlPassword, MysqlHost, MysqlPort, MysqlSchema)

  if Domain, err = web.AppConfig.String("Domain"); err != nil {
    return err
  }

  CorsAllowedOrigins = web.AppConfig.DefaultStrings("CorsAllowedOrigins", []string{"*"})

  return err
}

// MakeUserAgent creates a standard webhook User-Agent string
// to help us better identify bad actors
func MakeUserAgent(id string) string {
  return fmt.Sprintf("%v/%v (%v; +https://%v/actions)", Domain, runtime.Version(), id, Domain)
}
