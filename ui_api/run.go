package ui_api

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/karngyan/maek/config"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"go.uber.org/fx"
	"go.uber.org/zap"
)

func Run(lc fx.Lifecycle, c *config.Config, l *zap.Logger) error {
	e := echo.New()

	e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
		LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
			l.Info("request",
				zap.String("URI", v.URI),
				zap.Int("status", v.Status),
				zap.Duration("latency", v.Latency),
				zap.String("remote_ip", v.RemoteIP),
				zap.String("method", v.Method),
				zap.String("request_id", v.RequestID),
				zap.String("ua", v.UserAgent),
				zap.String("content_length", v.ContentLength),
				zap.Int64("response_size", v.ResponseSize),
			)
			return nil
		},
		LogLatency:       true,
		LogRemoteIP:      true,
		LogMethod:        true,
		LogURI:           true,
		LogRequestID:     true, // we set `X-Request-ID` in response
		LogUserAgent:     true,
		LogStatus:        true,
		LogContentLength: true,
		LogResponseSize:  true,
	}))

	e.Use(middleware.RecoverWithConfig(middleware.RecoverConfig{
		StackSize: 1 << 12, // 4 KB
		LogErrorFunc: func(c echo.Context, err error, stack []byte) error {
			l.Error("recovered from panic", zap.Error(err), zap.ByteString("stack", stack))
			return nil
		},
	}))

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     c.Strings("api_server.cors_allowed_origins"),
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions, http.MethodPatch},
		AllowHeaders:     []string{"Content-Type", "Authorization", "Origin", "X-Request-ID"},
		AllowCredentials: true,
		ExposeHeaders:    []string{"Content-Length"},
		MaxAge:           int((24 * time.Hour).Seconds()),
	}))

	server := &http.Server{
		Addr:              fmt.Sprintf("0.0.0.0:%s", c.String("api_server.port")),
		Handler:           e,
		ReadTimeout:       15 * time.Second,
		ReadHeaderTimeout: 5 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
		MaxHeaderBytes:    1 << 20, // 1 MB
	}

	lc.Append(fx.Hook{
		OnStart: func(ctx context.Context) error {
			go func() {
				l.Info("starting ui_api server", zap.String("addr", server.Addr))
				if err := e.StartServer(server); err != nil && errors.Is(err, http.ErrServerClosed) {
					l.Error("error starting echo server", zap.Error(err))
				}
			}()
			return nil
		},
		OnStop: func(ctx context.Context) error {
			l.Info("shutdown signal received")
			return e.Shutdown(ctx)
		},
	})

	l.Info("ui_api server started", zap.String("addr", server.Addr))

	return nil
}
