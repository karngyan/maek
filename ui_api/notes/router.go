package notes

import (
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"

	"github.com/karngyan/maek/ui_api/web"
)

func Configure(e *echo.Echo, l *zap.Logger) {
	e.GET("/v1/workspaces/:workspace_id/notes", web.WrapAuthenticated(list, l))
	e.DELETE("/v1/workspaces/:workspace_id/notes", web.WrapAuthenticated(trashBatch, l))
	e.POST("/v1/workspaces/:workspace_id/notes/collab-auth", web.WrapAuthenticated(getCollaborationToken, l))
	e.PUT("/v1/workspaces/:workspace_id/notes/:note_uuid", web.WrapAuthenticatedWithCurrentWorkspace(upsert, l))
	e.GET("/v1/workspaces/:workspace_id/notes/:note_uuid", web.WrapAuthenticated(get, l))
	e.DELETE("/v1/workspaces/:workspace_id/notes/:note_uuid", web.WrapAuthenticated(trash, l))
	e.GET("/v1/workspaces/:workspace_id/notes/:note_uuid/collections", web.WrapAuthenticated(listCollectionsForNote, l))
	e.POST("/v1/workspaces/:workspace_id/notes/:note_uuid/collections", web.WrapAuthenticated(addCollections, l))
	e.DELETE("/v1/workspaces/:workspace_id/notes/:note_uuid/collections", web.WrapAuthenticated(removeCollections, l))
}
