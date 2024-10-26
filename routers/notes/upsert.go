package notes

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/routers/base"
)

func Upsert(ctx *base.WebContext) {
	nuuid := strings.TrimSpace(ctx.Input.Param(":note_uuid"))
	if nuuid == "" {
		base.BadRequest(ctx, map[string]any{
			"note_uuid": "note_uuid is required",
		})
		return
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

	if err := ctx.DecodeJSON(&req); err != nil {
		base.UnprocessableEntity(ctx, err)
		return
	}

	rctx := ctx.Request.Context()

	contentBytes, err := json.Marshal(req.Content)
	if err != nil {
		base.InternalError(ctx, err)
		return
	}

	note, err := notes.UpsertNoteCtx(rctx, &notes.UpsertNoteRequest{
		Uuid:           nuuid,
		Content:        string(contentBytes),
		Favorite:       req.Favorite,
		Created:        req.Created,
		Updated:        req.Updated,
		Workspace:      ctx.Workspace,
		CreatedBy:      ctx.User, // only used if it's an insert, otherwise ignored
		UpdatedBy:      ctx.User,
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
		base.InternalError(ctx, err)
		return
	}

	uiNote, err := modelForNote(note)
	if err != nil {
		base.InternalError(ctx, err)
		return
	}

	base.Respond(ctx, map[string]any{
		"note": uiNote,
	}, http.StatusOK)
}
