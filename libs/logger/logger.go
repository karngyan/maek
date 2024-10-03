package logger

import (
  "context"
  "fmt"
  "io"
  "log"
  "log/slog"
  "path/filepath"
  "runtime"
  "time"
)

type TraceIDFn func(ctx context.Context) string

type Logger struct {
  handler   slog.Handler
  traceIDFn TraceIDFn
}

func New(w io.Writer, minLevel Level, serviceName string, traceIDFn TraceIDFn) *Logger {
  return newLogger(w, minLevel, serviceName, traceIDFn, Events{})
}

func NewWithEvents(w io.Writer, minLevel Level, serviceName string, traceIDFn TraceIDFn, events Events) *Logger {
  return newLogger(w, minLevel, serviceName, traceIDFn, events)
}

func NewWithHandler(h slog.Handler) *Logger {
  return &Logger{handler: h}
}

func NewStdLogger(logger *Logger, level Level) *log.Logger {
  return slog.NewLogLogger(logger.handler, slog.Level(level))
}

func (log *Logger) Debug(ctx context.Context, msg string, args ...any) {
  log.write(ctx, LevelDebug, 3, msg, args...)
}

func (log *Logger) Debugc(ctx context.Context, caller int, msg string, args ...any) {
  log.write(ctx, LevelDebug, caller, msg, args...)
}

func (log *Logger) Info(ctx context.Context, msg string, args ...any) {
  log.write(ctx, LevelInfo, 3, msg, args...)
}

func (log *Logger) Infoc(ctx context.Context, caller int, msg string, args ...any) {
  log.write(ctx, LevelInfo, caller, msg, args...)
}

func (log *Logger) Warn(ctx context.Context, msg string, args ...any) {
  log.write(ctx, LevelWarn, 3, msg, args...)
}

func (log *Logger) Warnc(ctx context.Context, caller int, msg string, args ...any) {
  log.write(ctx, LevelWarn, caller, msg, args...)
}

func (log *Logger) Error(ctx context.Context, msg string, args ...any) {
  log.write(ctx, LevelError, 3, msg, args...)
}

func (log *Logger) Errorc(ctx context.Context, caller int, msg string, args ...any) {
  log.write(ctx, LevelError, caller, msg, args...)
}

func (log *Logger) write(ctx context.Context, level Level, caller int, msg string, args ...any) {
  slogLevel := slog.Level(level)

  if !log.handler.Enabled(ctx, slogLevel) {
    return
  }

  var pcs [1]uintptr
  runtime.Callers(caller, pcs[:])

  r := slog.NewRecord(time.Now(), slogLevel, msg, pcs[0])

  if log.traceIDFn != nil {
    args = append(args, "trace_id", log.traceIDFn(ctx))
  }
  r.Add(args...)

  _ = log.handler.Handle(ctx, r)
}

func newLogger(w io.Writer, minLevel Level, serviceName string, traceIDFn TraceIDFn, events Events) *Logger {

  f := func(groups []string, a slog.Attr) slog.Attr {
    if a.Key == slog.SourceKey {
      if source, ok := a.Value.Any().(*slog.Source); ok {
        v := fmt.Sprintf("%s:%d", filepath.Base(source.File), source.Line)
        return slog.Attr{Key: "file", Value: slog.StringValue(v)}
      }
    }

    return a
  }

  handler := slog.Handler(slog.NewJSONHandler(w, &slog.HandlerOptions{AddSource: true, Level: slog.Level(minLevel), ReplaceAttr: f}))

  if events.Debug != nil || events.Info != nil || events.Warn != nil || events.Error != nil {
    handler = newLogHandler(handler, events)
  }

  attrs := []slog.Attr{
    {Key: "service", Value: slog.StringValue(serviceName)},
  }

  handler = handler.WithAttrs(attrs)

  return &Logger{
    handler:   handler,
    traceIDFn: traceIDFn,
  }
}
