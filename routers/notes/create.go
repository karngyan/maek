package notes

import (
	"encoding/json"
	"net/http"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/routers/base"
)

func Create(ctx *base.WebContext) {
	var req struct {
		Content  map[string]any `json:"content"`
		Favorite bool           `json:"favorite"`
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

	note, err := notes.CreateNoteCtx(rctx, notes.WithContent(string(contentBytes)), notes.WithFavorite(req.Favorite), notes.WithWorkspace(ctx.Workspace), notes.WithCreatedBy(ctx.User))
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
	}, http.StatusCreated)
}
