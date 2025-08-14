"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Clock, User, RefreshCw, TrendingUp } from 'lucide-react';

interface NewsSource {
  id: string;
  name: string;
}

interface NewsArticle {
  source: NewsSource;
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

interface NewsResponse {
  result: {
    status: string;
    totalResults: number;
    articles: NewsArticle[];
  };
}

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAuthorName = (author: string) => {
    if (!author) return 'Unknown Author';
    // Clean up author string (remove extra info after commas)
    return author.split(',')[0].trim();
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:bg-white/5 border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <Badge variant="secondary" className="bg-blue-600/20 text-blue-200 border-blue-500/30">
            {article.source.name}
          </Badge>
          <div className="flex items-center text-xs text-gray-400 gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(article.publishedAt)}
          </div>
        </div>
        <CardTitle className="text-lg font-bold text-white leading-tight group-hover:text-blue-200 transition-colors duration-200">
          {article.title}
        </CardTitle>
        {article.author && (
          <div className="flex items-center text-sm text-gray-400 gap-1 mt-1">
            <User className="w-3 h-3" />
            {getAuthorName(article.author)}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {article.urlToImage && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src={article.urlToImage} 
              alt={article.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        <CardDescription className="text-gray-300 text-sm leading-relaxed mb-4">
          {article.description}
        </CardDescription>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full bg-transparent border-blue-500/30 text-blue-200 hover:bg-blue-700/20 hover:border-blue-400/50 transition-all duration-200"
          onClick={() => window.open(article.url, '_blank')}
        >
          Read Full Article
          <ExternalLink className="w-3 h-3 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

const LoadingSkeleton: React.FC = () => (
  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-3 mb-2">
        <Skeleton className="h-6 w-20 bg-white/10" />
        <Skeleton className="h-4 w-24 bg-white/10" />
      </div>
      <Skeleton className="h-6 w-full bg-white/10" />
      <Skeleton className="h-4 w-32 bg-white/10 mt-1" />
    </CardHeader>
    <CardContent className="pt-0">
      <Skeleton className="h-48 w-full rounded-lg bg-white/10 mb-4" />
      <Skeleton className="h-4 w-full bg-white/10 mb-2" />
      <Skeleton className="h-4 w-3/4 bg-white/10 mb-4" />
      <Skeleton className="h-9 w-full bg-white/10" />
    </CardContent>
  </Card>
);

const FinanceNews: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState<number>(0);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/finance/news');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: NewsResponse = await response.json();
      
      if (data.result.status === 'ok') {
        setArticles(data.result.articles);
        setTotalResults(data.result.totalResults);
      } else {
        throw new Error('API returned error status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
      // Fallback to sample data for development
      console.warn('Using sample data due to API error:', err);
      setArticles([
        {
          source: { id: "", name: "Forbes" },
          author: "Tim Newcomb, Contributor",
          title: "Asics Expands Blast Running Shoes With New Foam And Two New Styles",
          description: "The new MegaBlast and SonicBlast feature the brand's new proprietary FF Turbo Squared foam for a 'bouncy' ride",
          url: "https://www.forbes.com/sites/timnewcomb/2025/08/13/asics-expands-blast-running-shoes-with-new-foam-and-two-new-styles/",
          urlToImage: "https://imageio.forbes.com/specials-images/imageserve/6894cb20f42ba5db1c7cee4c/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds",
          publishedAt: "2025-08-13T04:15:00Z",
          content: "Asics expands the Blast running shoe lineup..."
        }
      ]);
      setTotalResults(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  Finance News Dashboard
                </h1>
                <p className="text-blue-200 text-sm">
                  {totalResults > 0 ? `${totalResults.toLocaleString()} articles available` : 'Stay updated with the latest finance news'}
                </p>
              </div>
            </div>
            <Button
              onClick={fetchNews}
              disabled={loading}
              variant="outline"
              className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/30"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <Alert className="mb-6 bg-red-900/20 border-red-500/30 text-red-200">
            <AlertDescription>
              {error} - Showing sample data for demonstration.
            </AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <NewsCard key={`${article.url}-${index}`} article={article} />
              ))}
            </div>

            {articles.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-white/60 text-lg">No articles found</div>
                <Button
                  onClick={fetchNews}
                  variant="outline"
                  className="mt-4 bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  Try Again
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center text-blue-200 text-sm">
            <p>Powered by Quantamental</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FinanceNews;