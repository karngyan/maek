package collections

import (
	"errors"
	"net/http"

	"github.com/labstack/echo/v4"

	"github.com/karngyan/maek/domains/collections"
	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/ui_api/models"
	"github.com/karngyan/maek/ui_api/web"
)

func get(ctx web.Context) error {
	var (
		cid int64
		wid int64
	)
	echo.PathParamsBinder(ctx).
		Int64("collection_id", &cid).
		Int64("workspace_id", &wid)

	if cid <= 0 {
		return ctx.JSON(http.StatusBadRequest, map[string]any{
			"note_uuid": "collection_id is required",
		})
	}

	rctx := ctx.Request().Context()
	c, err := collections.FindCollectionByID(rctx, wid, cid)
	if err != nil {
		if errors.Is(err, collections.ErrCollectionNotFound) {
			return ctx.JSON(http.StatusNotFound, map[string]any{
				"error": "Collection not found",
			})
		}

		return ctx.InternalError(err)
	}

	uiC := models.ModelForCollection(c)

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
		"collection": uiC,
		"notes":      uiNotes,
	})
}
