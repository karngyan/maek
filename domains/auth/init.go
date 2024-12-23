package auth

import (
	"context"
	"time"

	"github.com/karngyan/maek/config"
	"github.com/karngyan/maek/libs/logger"
	"go.uber.org/zap"

	"github.com/allegro/bigcache/v3"
)

var (
	sessionCache *bigcache.BigCache
)

func Init(l *zap.Logger, c *config.Config) error {
	var err error

	conf := bigcache.Config{
		Shards:             1 << 10, // 1024
		LifeWindow:         10 * time.Minute,
		CleanWindow:        5 * time.Minute,
		MaxEntriesInWindow: 1000 * 10 * 60,
		MaxEntrySize:       500,
		StatsEnabled:       false,
		Verbose:            c.IsDev(),
		HardMaxCacheSize:   1 << 13, // 8192
		Logger:             logger.NewBigCacheLogger(l),
	}

	sessionCache, err = bigcache.New(context.Background(), conf)
	if err != nil {
		l.Error("failed to create session cache", zap.Error(err))
		return err
	}

	return nil
}
