package collections

import (
	"errors"
	"net/http"

	"github.com/karngyan/maek/domains/collections"
	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/ui_api/models"

	"github.com/karngyan/maek/ui_api/web"
	"github.com/labstack/echo/v4"
)

func addNotes(ctx web.Context) error {
	var (
		cid int64
		wid int64
	)

	echo.PathParamsBinder(ctx).
		Int64("collection_id", &cid).
		Int64("workspace_id", &wid)

	if cid == 0 {
		return ctx.JSON(http.StatusBadRequest, map[string]any{
			"collection_id": "collection_id is required",
		})
	}

	var req struct {
		NoteIDs []int64 `json:"noteIds"`
	}

	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusUnprocessableEntity, map[string]any{
			"error": err.Error(),
		})
	}

	rctx := ctx.Request().Context()
	c, err := collections.AddNotesToCollection(rctx, wid, cid, req.NoteIDs)
	if err != nil {
		if errors.Is(err, collections.ErrCollectionNotFound) {
			return ctx.JSON(http.StatusNotFound, map[string]any{
				"error": "Collection not found",
			})
		}

		return ctx.InternalError(err)
	}

	ns, err := notes.FindNotesForCollection(rctx, wid, cid)
	if err != nil {
		return ctx.InternalError(err)
	}

	uiNotes := make([]*models.Note, 0, len(ns))
	for _, n := range ns {
		uiN, err := models.ModelForNote(n)
		if err != nil {
			continue
		}

		uiNotes = append(uiNotes, uiN)
	}

	return ctx.JSON(http.StatusOK, map[string]any{
		"collection": models.ModelForCollection(c),
		"notes":      uiNotes,
	})
}
