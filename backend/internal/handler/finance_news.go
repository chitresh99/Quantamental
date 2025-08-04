package handler

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type FinanceNewsHandler struct {
	*BaseHandler
	client *FinanceNewsClient
}

func NewFinanceNewsHandler() *FinanceNewsHandler {
	apiKey := os.Getenv("NEWS_API_KEY")
	if apiKey == "" {
		panic("NEWS_API_KEY environment variable is required")
	}

	return &FinanceNewsHandler{
		BaseHandler: NewBaseHandler(),
		client:      NewFinanceNewsClient(apiKey),
	}
}

func (h *FinanceNewsHandler) GetFinanceNews(c *gin.Context) {
	var req FinanceNewsRequest

	if err := c.ShouldBindQuery(&req); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	if req.SortBy == "" {
		req.SortBy = "publishedAt"
	}
	if req.PageSize == 0 {
		req.PageSize = 20
	}
	if req.Page == 0 {
		req.Page = 1
	}

	if err := h.validateFinanceNewsRequest(req); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	result, err := h.client.GetFinanceNews(req)
	if err != nil {
		h.SendError(c, http.StatusInternalServerError, "Failed to fetch finance news: "+err.Error())
		return
	}

	h.SendSuccess(c, result)
}

func (h *FinanceNewsHandler) SearchFinanceNews(c *gin.Context) {
	var req FinanceNewsRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	// Set defaults
	if req.SortBy == "" {
		req.SortBy = "publishedAt"
	}
	if req.PageSize == 0 {
		req.PageSize = 20
	}
	if req.Page == 0 {
		req.Page = 1
	}

	if err := h.validateFinanceNewsRequest(req); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	result, err := h.client.GetFinanceNews(req)
	if err != nil {
		h.SendError(c, http.StatusInternalServerError, "Failed to search finance news: "+err.Error())
		return
	}

	h.SendSuccess(c, result)
}

func (h *FinanceNewsHandler) GetFinanceSources(c *gin.Context) {
	var req FinanceSourcesRequest

	if err := c.ShouldBindQuery(&req); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	result, err := h.client.GetFinanceSources(req)
	if err != nil {
		h.SendError(c, http.StatusInternalServerError, "Failed to fetch finance sources: "+err.Error())
		return
	}

	h.SendSuccess(c, result)
}

func (h *FinanceNewsHandler) validateFinanceNewsRequest(req FinanceNewsRequest) error {

	validSortBy := []string{"relevancy", "popularity", "publishedAt"}
	if req.SortBy != "" && !contains(validSortBy, req.SortBy) {
		return fmt.Errorf("sortBy must be one of: %s", strings.Join(validSortBy, ", "))
	}

	if req.PageSize < 1 || req.PageSize > 100 {
		return fmt.Errorf("pageSize must be between 1 and 100")
	}

	if req.Page < 1 {
		return fmt.Errorf("page must be 1 or greater")
	}

	if req.From != "" {
		if _, err := time.Parse("2006-01-02", req.From); err != nil {
			return fmt.Errorf("from date must be in YYYY-MM-DD format")
		}
	}

	if req.To != "" {
		if _, err := time.Parse("2006-01-02", req.To); err != nil {
			return fmt.Errorf("to date must be in YYYY-MM-DD format")
		}
	}

	return nil
}

func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}
