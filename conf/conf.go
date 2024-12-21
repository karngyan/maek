package conf

import (
	"os"
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
	Root               string
	SQLConn            string
	SQLConnTest        string
	CorsAllowedOrigins []string
)

func IsDevEnv() bool {
	return web.BConfig.RunMode == "dev"
}

func IsProdEnv() bool {
	return web.BConfig.RunMode == "prod"
}

func IsTestEnv() bool {
	return web.BConfig.RunMode == "test"
}

func Init() error {

	var err error

	err = web.LoadAppConfig("ini", os.Getenv("ROOT")+"/conf/app.conf")
	if err != nil {
		return err
	}

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

	web.BConfig.Log = web.LogConfig{
		AccessLogs:       false,
		EnableStaticLogs: true,
		FileLineNum:      true,
		AccessLogsFormat: "APACHE_FORMAT",
		Outputs:          nil,
	}

	web.BConfig.EnableGzip = true

	Root, err = get("Root")
	if err != nil {
		return err
	}

	SQLConn, err = get("SQLConn")
	if err != nil {
		return err
	}

	SQLConnTest, err = get("SQLConnTest")
	if err != nil {
		return err
	}

	CorsAllowedOrigins = web.AppConfig.DefaultStrings("CorsAllowedOrigins", []string{"*"})

	return err
}

func get(name string) (string, error) {
	v, err := web.AppConfig.String(name)
	if err != nil {
		return "", errors.WithMessage(err, "failed to read "+name)
	}

	if v == "" {
		return "", errors.New("conf." + name + " is empty")
	}

	return v, nil
}
