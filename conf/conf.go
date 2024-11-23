package conf

import (
	"fmt"
	"os"
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
	TestMysqlHost      string
	TestMysqlPort      string
	TestMysqlUser      string
	TestMysqlPassword  string
	SQLConn            string
	SQLTestConn        string
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

	if TestMysqlHost, err = web.AppConfig.String("TestMysqlHost"); err != nil {
		return err
	}

	if TestMysqlPort, err = web.AppConfig.String("TestMysqlPort"); err != nil {
		return err
	}

	if TestMysqlUser, err = web.AppConfig.String("TestMysqlUser"); err != nil {
		return err
	}

	if TestMysqlPassword, err = web.AppConfig.String("TestMysqlPassword"); err != nil {
		return err
	}

	SQLConn = fmt.Sprintf("%v:%v@tcp(%v:%v)/%v?charset=utf8mb4&collation=utf8mb4_0900_ai_ci", MysqlUser, MysqlPassword, MysqlHost, MysqlPort, MysqlSchema)
	SQLTestConn = fmt.Sprintf("%v:%v@tcp(%v:%v)/", TestMysqlUser, TestMysqlPassword, TestMysqlHost, TestMysqlPort)

	CorsAllowedOrigins = web.AppConfig.DefaultStrings("CorsAllowedOrigins", []string{"*"})

	return err
}
