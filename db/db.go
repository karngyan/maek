package db

import (
	"context"
	"database/sql"
	"time"

	"github.com/beego/beego/v2/client/orm"
	_ "github.com/go-sql-driver/mysql"

	"github.com/karngyan/maek/conf"
)

var o orm.Ormer

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

	return nil
}

func InitTest() error {
	if err := orm.RegisterDriver("mysql", orm.DRMySQL); err != nil {
		return err
	}

	maxIdle := 100
	maxConn := 100

	if err := orm.RegisterDataBase("default", "mysql", conf.SQLTestConn, orm.MaxIdleConnections(maxIdle), orm.MaxOpenConnections(maxConn)); err != nil {
		return err
	}

	orm.DefaultTimeLoc = time.UTC

	return nil
}

func InitOrmer() error {
	o = orm.NewOrm()
	return nil
}

func WithOrmer(fn func(orm.Ormer) error) error {
	return fn(o)
}

func WithTxOrmer(fn func(ctx context.Context, txOrmer orm.TxOrmer) error) error {
	return o.DoTx(fn)
}

func WithTxOrmerCtx(ctx context.Context, fn func(ctx context.Context, txOrmer orm.TxOrmer) error) error {
	return o.DoTxWithCtx(ctx, fn)
}

func WithTxOrmerOpts(opts *sql.TxOptions, fn func(ctx context.Context, txOrmer orm.TxOrmer) error) error {
	return o.DoTxWithOpts(opts, fn)
}

func WithTxOrmerCtxAndOpts(ctx context.Context, opts *sql.TxOptions, fn func(ctx context.Context, txOrmer orm.TxOrmer) error) error {
	return o.DoTxWithCtxAndOpts(ctx, opts, fn)
}
