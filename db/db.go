package db

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"ariga.io/atlas-go-sdk/atlasexec"
	"github.com/beego/beego/v2/client/orm"
	"github.com/beego/beego/v2/core/logs"
	_ "github.com/lib/pq"

	"github.com/karngyan/maek/conf"
	"github.com/karngyan/maek/libs/randstr"
)

func Init() error {
	if err := orm.RegisterDriver("postgres", orm.DRPostgres); err != nil {
		return err
	}

	maxIdle := 100
	maxConn := 100

	if err := orm.RegisterDataBase("default", "postgres", conf.SQLConn, orm.MaxIdleConnections(maxIdle), orm.MaxOpenConnections(maxConn)); err != nil {
		return err
	}

	orm.DefaultTimeLoc = time.UTC

	return nil
}

func InitTest() (func(), error) {
	if err := orm.RegisterDriver("postgres", orm.DRPostgres); err != nil {
		return func() {}, err
	}

	maxIdle := 100
	maxConn := 100

	nsDb, err := sql.Open("postgres", conf.SQLConnTest)
	if err != nil {
		return func() {}, err
	}
	if err := nsDb.Ping(); err != nil {
		return func() {}, err
	}

	randSchemaName := randstr.Base62(10)
	_, err = nsDb.Exec("CREATE SCHEMA IF NOT EXISTS " + randSchemaName)
	if err != nil {
		logs.Info("error creating test schema: %v", err)
		return func() {}, err
	}

	logs.Info("created test schema %s", randSchemaName)

	// register with the newly created schema
	dsn := fmt.Sprintf("%s&search_path=%s", conf.SQLConnTest, randSchemaName)
	if err := orm.RegisterDataBase("default", "postgres", dsn, orm.MaxIdleConnections(maxIdle), orm.MaxOpenConnections(maxConn)); err != nil {
		return func() {}, err
	}

	orm.DefaultTimeLoc = time.UTC

	// schema apply
	atlas, err := atlasexec.NewClient("./", "atlas")
	if err != nil {
		logs.Info("error creating atlas client: %v", err)
		return func() {}, err
	}

	_, err = atlas.SchemaApply(context.Background(), &atlasexec.SchemaApplyParams{
		DevURL:      conf.AtlasTmpDevURL,
		URL:         dsn,
		To:          fmt.Sprintf("file://%s/schema", conf.Root),
		AutoApprove: true,
	})
	if err != nil {
		return func() {}, err
	}

	return func() {
		_, err = nsDb.Exec("DROP SCHEMA " + randSchemaName)
		if err != nil {
			logs.Info("error dropping test schema: %v", err)
			return
		}

		logs.Info("dropped test schema: %s", randSchemaName)

		err = nsDb.Close()
		if err != nil {
			logs.Info("error closing test db: %v", err)
			return
		}

		logs.Info("closed db connection")

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
