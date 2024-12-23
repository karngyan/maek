package db

import (
	"context"
	"embed"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/fx"
	"go.uber.org/zap"

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

func InitTest(lc fx.Lifecycle, c *config.Config, l *zap.Logger) error {
	ctx := context.Background()

	randSchema := randstr.Alpha(10)
	dsnTest := c.String("database.dsn_test")

	sconn, err := pgx.Connect(ctx, dsnTest)
	if err != nil {
		l.Error("error connecting to test db", zap.Error(err))
		return err
	}

	_, err = sconn.Exec(ctx, fmt.Sprintf(`CREATE SCHEMA IF NOT EXISTS "%s"`, randSchema))
	if err != nil {
		l.Error("error creating test schema", zap.Error(err))
		return err
	}

	l.Info("created test schema", zap.String("schema", randSchema))
	err = sconn.Close(ctx)
	if err != nil {
		return err
	} else {
		l.Info("closed test db connection for schema creation", zap.String("schema", randSchema))
	}

	connString := fmt.Sprintf(`%s&search_path="%s"`, dsnTest, randSchema)
	dbc, err := pgxpool.ParseConfig(connString)
	if err != nil {
		return err
	}

	dbc.MaxConns = 100
	dbc.MinConns = 10
	dbc.MaxConnLifetime = 30 * time.Minute
	dbc.MaxConnLifetime = 5 * time.Minute
	dbc.MaxConnIdleTime = 5 * time.Minute
	dbc.HealthCheckPeriod = 1 * time.Minute

	defaultPgxPool, err = pgxpool.NewWithConfig(ctx, dbc)
	if err != nil {
		return err
	}

	err = applySchema(ctx, defaultPgxPool)
	if err != nil {
		l.Error("error applying schema", zap.Error(err))
		return err
	}

	Q = New(defaultPgxPool)

	lc.Append(fx.Hook{
		OnStop: func(ctx context.Context) error {
			_, err = defaultPgxPool.Exec(ctx, fmt.Sprintf(`DROP SCHEMA %s CASCADE`, randSchema))
			if err != nil {
				l.Error("error dropping test schema", zap.Error(err))
				return err
			}

			l.Info("dropped test schema", zap.String("schema", randSchema))

			defaultPgxPool.Close()

			l.Info("closed db pool")
			return nil
		},
	})

	return nil
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
	}
	return nil
}
