package main

import (
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.CORS())

	// Default route
	e.GET("/", func(c echo.Context) error {
		memos, err := GetAllMemos()
		if err != nil {
			return c.String(http.StatusInternalServerError, "Database error: "+err.Error())
		}
		return c.JSON(http.StatusOK, memos)
	})

	// Health check endpoint
	e.GET("/health", func(c echo.Context) error {
		return c.String(http.StatusOK, "Server running normally")
	})

	// Create memo
	e.POST("/memo", func(c echo.Context) error {
		type Req struct {
			Title      string `json:"title"`
			Content    string `json:"content"`
			IsPinned   bool   `json:"isPinned"`
			IsArchived bool   `json:"isArchived"`
		}
		var req Req
		if err := c.Bind(&req); err != nil {
			return c.String(http.StatusBadRequest, "Invalid request")
		}
		id, err := CreateMemo(req.Title, req.Content, req.IsPinned, req.IsArchived)
		if err != nil {
			return c.String(http.StatusInternalServerError, err.Error())
		}
		return c.JSON(http.StatusOK, map[string]interface{}{"id": id})
	})

	// Update memo
	e.PUT("/memo/:id", func(c echo.Context) error {
		id, err := parseIDParam(c.Param("id"))
		if err != nil {
			return c.String(http.StatusBadRequest, "Invalid id")
		}
		type Req struct {
			Title      string `json:"title"`
			Content    string `json:"content"`
			IsPinned   bool   `json:"isPinned"`
			IsArchived bool   `json:"isArchived"`
		}
		var req Req
		if err := c.Bind(&req); err != nil {
			return c.String(http.StatusBadRequest, "Invalid request")
		}
		err = UpdateMemo(id, req.Title, req.Content, req.IsPinned, req.IsArchived)
		if err != nil {
			return c.String(http.StatusInternalServerError, err.Error())
		}
		return c.NoContent(http.StatusOK)
	})

	// Delete memo (move to trash)
	e.DELETE("/memo/:id", func(c echo.Context) error {
		id, err := parseIDParam(c.Param("id"))
		if err != nil {
			return c.String(http.StatusBadRequest, "Invalid id")
		}
		err = SoftDeleteMemo(id)
		if err != nil {
			return c.String(http.StatusInternalServerError, err.Error())
		}
		return c.NoContent(http.StatusOK)
	})

	// Restore memo (from trash)
	e.PATCH("/memo/:id/restore", func(c echo.Context) error {
		id, err := parseIDParam(c.Param("id"))
		if err != nil {
			return c.String(http.StatusBadRequest, "Invalid id")
		}
		err = RestoreMemo(id)
		if err != nil {
			return c.String(http.StatusInternalServerError, err.Error())
		}
		return c.NoContent(http.StatusOK)
	})

	// Trash (deleted memos) list
	e.GET("/trash", func(c echo.Context) error {
		memos, err := GetDeletedMemos()
		if err != nil {
			return c.String(http.StatusInternalServerError, err.Error())
		}
		return c.JSON(http.StatusOK, memos)
	})

	// Permanently delete memos older than 7 days
	e.DELETE("/trash/permanent", func(c echo.Context) error {
		err := PermanentlyDeleteOldMemos()
		if err != nil {
			return c.String(http.StatusInternalServerError, err.Error())
		}
		return c.NoContent(http.StatusOK)
	})

	// Start server
	go func() {
		if err := e.Start(":6727"); err != nil {
			e.Logger.Fatal(err)
		}
	}()

	// Signal handling for graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	// Clean up database connection on server shutdown
	CloseDB()
	e.Logger.Info("Shutting down server...")
}

func parseIDParam(idStr string) (int64, error) {
	var id int64
	_, err := fmt.Sscanf(idStr, "%d", &id)
	return id, err
}
