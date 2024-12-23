package notes

import (
	"encoding/json"
	"net/http"

	"github.com/karngyan/maek/ui_api/web"
	"github.com/labstack/echo/v4"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/routers/models"
)

func upsert(ctx web.Context) error {
	var (
		nuuid string
		wid   int64
	)
	echo.PathParamsBinder(ctx).
		String("note_uuid", &nuuid).
		Int64("workspace_id", &wid)

	if nuuid == "" {
		return ctx.JSON(http.StatusBadRequest, map[string]any{
			"note_uuid": "note_uuid is required",
		})
	}

	var req struct {
		Content        map[string]any `json:"content"`
		Favorite       bool           `json:"favorite"`
		Created        int64          `json:"created"`
		Updated        int64          `json:"updated"`
		HasContent     bool           `json:"hasContent"`
		HasImages      bool           `json:"hasImages"`
		HasVideos      bool           `json:"hasVideos"`
		HasOpenTasks   bool           `json:"hasOpenTasks"`
		HasClosedTasks bool           `json:"hasClosedTasks"`
		HasCode        bool           `json:"hasCode"`
		HasAudios      bool           `json:"hasAudios"`
		HasLinks       bool           `json:"hasLinks"`
		HasFiles       bool           `json:"hasFiles"`
		HasQuotes      bool           `json:"hasQuotes"`
		HasTables      bool           `json:"hasTables"`
	}

	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusUnprocessableEntity, map[string]any{
			"error": err.Error(),
		})
	}

	rctx := ctx.Request().Context()

	contentBytes, err := json.Marshal(req.Content)
	if err != nil {
		return ctx.InternalError(err)
	}

	note, err := notes.UpsertNote(rctx, &notes.UpsertNoteRequest{
		UUID:           nuuid,
		Content:        contentBytes,
		Favorite:       req.Favorite,
		Created:        req.Created,
		Updated:        req.Updated,
		WorkspaceID:    ctx.WorkspaceID,
		CreatedByID:    ctx.Session.UserID,
		UpdatedByID:    ctx.Session.UserID,
		HasContent:     req.HasContent,
		HasImages:      req.HasImages,
		HasVideos:      req.HasVideos,
		HasOpenTasks:   req.HasOpenTasks,
		HasClosedTasks: req.HasClosedTasks,
		HasCode:        req.HasCode,
		HasAudios:      req.HasAudios,
		HasLinks:       req.HasLinks,
		HasFiles:       req.HasFiles,
		HasQuotes:      req.HasQuotes,
		HasTables:      req.HasTables,
	})
	if err != nil {
		return ctx.InternalError(err)
	}

	uiNote, err := models.ModelForNote(note)
	if err != nil {
		return ctx.InternalError(err)
	}

	return ctx.JSON(http.StatusOK, map[string]any{
		"note": uiNote,
	})
}
