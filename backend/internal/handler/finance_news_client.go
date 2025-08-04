package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

type FinanceNewsClient struct {
	apiKey         string
	baseURL        string
	httpClient     *http.Client
	defaultSources []string
}

func NewFinanceNewsClient(apiKey string) *FinanceNewsClient {
	return &FinanceNewsClient{
		apiKey:  apiKey,
		baseURL: "https://newsapi.org/v2",
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
		defaultSources: []string{
			"bloomberg",
			"cnbc",
			"business-insider",
			"financial-times",
			"the-wall-street-journal",
			"reuters",
			"marketwatch",
			"fortune",
			"forbes",
		},
	}
}

func (fnc *FinanceNewsClient) GetFinanceNews(req FinanceNewsRequest) (*FinanceNewsResponse, error) {
	params := url.Values{}

	if req.Query != "" {
		params.Add("q", req.Query)
	} else {
		params.Add("q", "stock OR market OR earnings OR finance OR trading OR investment")
	}

	if req.Sources != "" {
		params.Add("sources", req.Sources)
	} else {
		params.Add("sources", strings.Join(fnc.defaultSources, ","))
	}

	params.Add("domains", "bloomberg.com,cnbc.com,businessinsider.com,ft.com,wsj.com,reuters.com,marketwatch.com,fortune.com,forbes.com")

	if req.From != "" {
		params.Add("from", req.From)
	}
	if req.To != "" {
		params.Add("to", req.To)
	}

	sortBy := req.SortBy
	if sortBy == "" {
		sortBy = "publishedAt"
	}
	params.Add("sortBy", sortBy)

	if req.PageSize > 0 {
		params.Add("pageSize", strconv.Itoa(req.PageSize))
	}
	if req.Page > 0 {
		params.Add("page", strconv.Itoa(req.Page))
	}

	params.Add("apiKey", fnc.apiKey)

	url := fmt.Sprintf("%s/everything?%s", fnc.baseURL, params.Encode())
	return fnc.makeRequest(url)
}

func (fnc *FinanceNewsClient) GetFinanceSources(req FinanceSourcesRequest) (*FinanceSourcesResponse, error) {
	params := url.Values{}

	params.Add("category", "business")

	if req.Language != "" {
		params.Add("language", req.Language)
	}
	if req.Country != "" {
		params.Add("country", req.Country)
	}

	params.Add("apiKey", fnc.apiKey)

	url := fmt.Sprintf("%s/sources?%s", fnc.baseURL, params.Encode())

	resp, err := fnc.httpClient.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status: %d", resp.StatusCode)
	}

	var newsResp struct {
		Status  string `json:"status"`
		Sources []struct {
			ID   string `json:"id"`
			Name string `json:"name"`
			URL  string `json:"url"`
		} `json:"sources"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&newsResp); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	financeResp := &FinanceSourcesResponse{
		Status:  newsResp.Status,
		Sources: make([]FinanceSource, len(newsResp.Sources)),
	}

	for i, source := range newsResp.Sources {
		financeResp.Sources[i] = FinanceSource{
			ID:   source.ID,
			Name: source.Name,
			URL:  source.URL,
		}
	}

	return financeResp, nil
}

func (fnc *FinanceNewsClient) makeRequest(url string) (*FinanceNewsResponse, error) {
	resp, err := fnc.httpClient.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status: %d", resp.StatusCode)
	}

	var newsResp struct {
		Status       string `json:"status"`
		TotalResults int    `json:"totalResults"`
		Articles     []struct {
			Source struct {
				ID   string `json:"id"`
				Name string `json:"name"`
			} `json:"source"`
			Author      string    `json:"author"`
			Title       string    `json:"title"`
			Description string    `json:"description"`
			URL         string    `json:"url"`
			URLToImage  string    `json:"urlToImage"`
			PublishedAt time.Time `json:"publishedAt"`
			Content     string    `json:"content"`
		} `json:"articles"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&newsResp); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	financeResp := &FinanceNewsResponse{
		Status:       newsResp.Status,
		TotalResults: newsResp.TotalResults,
		Articles:     make([]FinanceArticle, len(newsResp.Articles)),
	}

	for i, article := range newsResp.Articles {
		financeResp.Articles[i] = FinanceArticle{
			Source: FinanceSource{
				ID:   article.Source.ID,
				Name: article.Source.Name,
			},
			Author:      article.Author,
			Title:       article.Title,
			Description: article.Description,
			URL:         article.URL,
			URLToImage:  article.URLToImage,
			PublishedAt: article.PublishedAt,
			Content:     article.Content,
		}
	}

	return financeResp, nil
}
