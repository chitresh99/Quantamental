package handler

import "time"

type FinanceNewsRequest struct {
	Query    string `json:"q" form:"q"`               // Stock symbols, company names, or financial keywords
	Sources  string `json:"sources" form:"sources"`   // Financial news sources (bloomberg, cnbc, business-insider, etc.)
	From     string `json:"from" form:"from"`         // Date for oldest article (YYYY-MM-DD)
	To       string `json:"to" form:"to"`             // Date for newest article (YYYY-MM-DD)
	SortBy   string `json:"sortBy" form:"sortBy"`     // Sort order: relevancy, popularity, publishedAt
	PageSize int    `json:"pageSize" form:"pageSize"` // Number of results per page (max 100)
	Page     int    `json:"page" form:"page"`         // Page number
}

type FinanceSourcesRequest struct {
	Language string `json:"language" form:"language"` // Language filter (en, etc.)
	Country  string `json:"country" form:"country"`   // Country filter (us, etc.)
}

// Finance News API response types
type FinanceNewsResponse struct {
	Status       string           `json:"status"`
	TotalResults int              `json:"totalResults"`
	Articles     []FinanceArticle `json:"articles"`
}

type FinanceSourcesResponse struct {
	Status  string          `json:"status"`
	Sources []FinanceSource `json:"sources"`
}

type FinanceArticle struct {
	Source      FinanceSource `json:"source"`
	Author      string        `json:"author"`
	Title       string        `json:"title"`
	Description string        `json:"description"`
	URL         string        `json:"url"`
	URLToImage  string        `json:"urlToImage"`
	PublishedAt time.Time     `json:"publishedAt"`
	Content     string        `json:"content"`
}

type FinanceSource struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	URL  string `json:"url,omitempty"`
}
