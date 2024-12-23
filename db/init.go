package db

import (
	"context"
	"embed"
	"fmt"
	"log"
	"time"

	"github.com/beego/beego/v2/core/logs"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/fx"
	"go.uber.org/zap"

	"github.com/karngyan/maek/conf"
	"github.com/karngyan/maek/config"
	"github.com/karngyan/maek/libs/randstr"
)

var (
	defaultPgxPool *pgxpool.Pool
	Q              *Queries
)

//go:embed schema/*.sql
var schemaFS embed.FS // only used in tests

func Init(lc fx.Lifecycle, c *config.Config, l *zap.Logger) error {
	dbc, err := pgxpool.ParseConfig(c.String("database.dsn"))
	if err != nil {
		return err
	}

	dbc.MaxConns = 100
	dbc.MinConns = 10
	dbc.MaxConnLifetime = 30 * time.Minute
	dbc.MaxConnLifetime = 5 * time.Minute
	dbc.MaxConnIdleTime = 5 * time.Minute
	dbc.HealthCheckPeriod = 1 * time.Minute

	defaultPgxPool, err = pgxpool.NewWithConfig(context.Background(), dbc)
	if err != nil {
		return err
	}

	Q = New(defaultPgxPool)

	lc.Append(fx.Hook{
		OnStop: func(ctx context.Context) error {
			l.Info("closing db pool")
			if defaultPgxPool != nil {
				defaultPgxPool.Close()
			}
			return nil
		},
	})

	l.Info("db pool initialized")

	return nil
}

func Close() {
	if defaultPgxPool != nil {
		defaultPgxPool.Close()
	}
}

func InitTest(ctx context.Context) (func(), error) {
	randSchema := randstr.Alpha(10)

	sconn, err := pgx.Connect(context.Background(), conf.SQLConnTest)
	if err != nil {
		logs.Info("error connecting to test db: %v", err)
		return func() {}, err
	}

	_, err = sconn.Exec(ctx, fmt.Sprintf(`CREATE SCHEMA IF NOT EXISTS "%s"`, randSchema))
	if err != nil {
		logs.Info("error creating test schema: %v", err)
		return func() {}, err
	}

	logs.Info("created test schema %s", randSchema)
	err = sconn.Close(ctx)
	if err != nil {
		return nil, err
	} else {
		logs.Info("closed test db connection for schema creation")
	}

	connString := fmt.Sprintf(`%s&search_path="%s"`, conf.SQLConnTest, randSchema)
	dbc, err := pgxpool.ParseConfig(connString)
	if err != nil {
		return func() {}, err
	}

	dbc.MaxConns = 100
	dbc.MinConns = 10
	dbc.MaxConnLifetime = 30 * time.Minute
	dbc.MaxConnLifetime = 5 * time.Minute
	dbc.MaxConnIdleTime = 5 * time.Minute
	dbc.HealthCheckPeriod = 1 * time.Minute

	defaultPgxPool, err = pgxpool.NewWithConfig(context.Background(), dbc)
	if err != nil {
		return func() {}, err
	}

	err = applySchema(ctx, defaultPgxPool)
	if err != nil {
		logs.Info("error applying schema: %v", err)
		return func() {}, err
	}

	Q = New(defaultPgxPool)

	return func() {
		_, err = defaultPgxPool.Exec(ctx, fmt.Sprintf(`DROP SCHEMA %s CASCADE`, randSchema))
		if err != nil {
			logs.Info("error dropping test schema: %v", err)
			return
		}

		logs.Info("dropped test schema: %s", randSchema)

		defaultPgxPool.Close()

		logs.Info("closed db pool")
	}, nil
}

func applySchema(ctx context.Context, pool *pgxpool.Pool) error {
	files, err := schemaFS.ReadDir("schema")
	if err != nil {
		return err
	}

	for _, file := range files {
		if file.IsDir() {
			continue
		}
		sqlBytes, err := schemaFS.ReadFile("schema/" + file.Name())
		if err != nil {
			return err
		}
		sql := string(sqlBytes)
		_, err = pool.Exec(ctx, sql)
		if err != nil {
			return err
		}
		log.Printf("Applied: %s", file.Name())
	}
	return nil
}
