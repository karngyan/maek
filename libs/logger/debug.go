package logger

import (
	"context"
	"runtime/debug"
	"strconv"
	"strings"
)

func (log *Logger) BuildInfo(ctx context.Context) {
	var values []any

	info, _ := debug.ReadBuildInfo()

	for _, s := range info.Settings {
		key := s.Key
		if quoteKey(key) {
			key = strconv.Quote(key)
		}

		value := s.Value
		if quoteValue(value) {
			value = strconv.Quote(value)
		}

		values = append(values, key, value)
	}

	values = append(values, "goversion", info.GoVersion)
	values = append(values, "modversion", info.Main.Version)

	log.Info(ctx, "build info", values...)
}

func quoteKey(key string) bool {
	return len(key) == 0 || strings.ContainsAny(key, "= \t\r\n\"`")
}

func quoteValue(value string) bool {
	return strings.ContainsAny(value, " \t\r\n\"`")
}
