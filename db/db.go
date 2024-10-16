package db

import (
	"context"
	"database/sql"
	"time"

	"github.com/beego/beego/v2/client/orm"
	"github.com/beego/beego/v2/core/logs"
	_ "github.com/go-sql-driver/mysql"
	"github.com/karngyan/maek/conf"
	"github.com/karngyan/maek/libs/randstr"
)

func Init() error {
	if err := orm.RegisterDriver("mysql", orm.DRMySQL); err != nil {
		return err
	}

	maxIdle := 100
	maxConn := 100

	if err := orm.RegisterDataBase("default", "mysql", conf.SQLConn, orm.MaxIdleConnections(maxIdle), orm.MaxOpenConnections(maxConn)); err != nil {
		return err
	}

	orm.DefaultTimeLoc = time.UTC

	if conf.IsDevEnv() {
		orm.Debug = true
	}

	return nil
}

func InitTest() (func(), error) {
	if err := orm.RegisterDriver("mysql", orm.DRMySQL); err != nil {
		return func() {}, err
	}

	maxIdle := 100
	maxConn := 100

	charset := "?charset=utf8mb4"

	// no schema db
	nsDb, err := sql.Open("mysql", conf.SQLTestConn)
	if err != nil {
		return func() {}, err
	}
	if err := nsDb.Ping(); err != nil {
		return func() {}, err
	}

	randDbName := randstr.Base62(10)
	_, err = nsDb.Exec("CREATE DATABASE IF NOT EXISTS " + randDbName)
	if err != nil {
		logs.Info("error creating test db: %v", err)
		return func() {}, err
	}

	logs.Info("created test db %s", randDbName)

	// register with the newly created db
	if err := orm.RegisterDataBase("default", "mysql", conf.SQLTestConn+randDbName+charset, orm.MaxIdleConnections(maxIdle), orm.MaxOpenConnections(maxConn)); err != nil {
		return func() {}, err
	}

	orm.DefaultTimeLoc = time.UTC

	return func() {
		_, err = nsDb.Exec("DROP DATABASE " + randDbName)
		if err != nil {
			logs.Info("error dropping test db: %v", err)
			return
		}

		logs.Info("dropped test db: %s", randDbName)

		err = nsDb.Close()
		if err != nil {
			logs.Info("error closing test db: %v", err)
			return
		}

		logs.Info("closed connection to nsdb")

	}, nil
}

func WithOrmer(fn func(orm.Ormer) error) error {
	o := orm.NewOrm()
	return fn(o)
}

func WithOrmerCtx(ctx context.Context, fn func(ctx context.Context, ormer orm.Ormer) error) error {
	o := orm.NewOrm()
	return fn(ctx, o)
}

func WithTxOrmer(fn func(ctx context.Context, txOrmer orm.TxOrmer) error) error {
	o := orm.NewOrm()
	return o.DoTx(fn)
}

func WithTxOrmerCtx(ctx context.Context, fn func(ctx context.Context, txOrmer orm.TxOrmer) error) error {
	o := orm.NewOrm()
	return o.DoTxWithCtx(ctx, fn)
}

func WithTxOrmerOpts(opts *sql.TxOptions, fn func(ctx context.Context, txOrmer orm.TxOrmer) error) error {
	o := orm.NewOrm()
	return o.DoTxWithOpts(opts, fn)
}

func WithTxOrmerCtxAndOpts(ctx context.Context, opts *sql.TxOptions, fn func(ctx context.Context, txOrmer orm.TxOrmer) error) error {
	o := orm.NewOrm()
	return o.DoTxWithCtxAndOpts(ctx, opts, fn)
}
