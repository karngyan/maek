package conf

import (
  "fmt"
  "runtime"
  "time"

  "github.com/beego/beego/v2/server/web"
  "github.com/pkg/errors"
)

// NoStatus is a placeholder when there's no valid HTTP status
// to return with a request
const NoStatus = -1

// DefaultRequestTimeout is the maximum TTL for individual requests
const DefaultRequestTimeout = 10 * time.Second

// DefaultMaxRead sets a cap on how much data we will read from an individual response
const DefaultMaxRead = 1024 * 1024 // 1MB

var (
  SQLConn            string
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

  if SQLConn, err = web.AppConfig.String("SQLConn"); err != nil {
    return errors.WithStack(err)
  }

  CorsAllowedOrigins = web.AppConfig.DefaultStrings("CorsAllowedOrigins", []string{"*"})

  return err
}

// MakeUserAgent creates a standard webhook User-Agent string
// to help us better identify bad actors
func MakeUserAgent(id string) string {
  return fmt.Sprintf("maek.ai/%v (%v; +https://maek.ai/actions)", runtime.Version(), id)
}
