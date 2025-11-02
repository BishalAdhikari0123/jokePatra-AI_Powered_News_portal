'use client';

import { useEffect, useState } from 'react';
import { ArticleCard } from '@/components/ArticleCard';
import { Article } from '@/lib/types';
import { Loader2, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchArticles = async (pageNum: number) => {
    try {
      setLoading(true);
      const limit = 9;
      const offset = (pageNum - 1) * limit;
      const response = await fetch(
        `/api/articles?limit=${limit}&offset=${offset}`
      );
      const data = await response.json();

      if (data.success) {
        if (pageNum === 1) {
          setArticles(data.data.articles);
        } else {
          setArticles((prev) => [...prev, ...data.data.articles]);
        }
        setHasMore(data.data.articles.length === limit);
      } else {
        setError(data.error || 'Failed to fetch articles');
      }
    } catch (err) {
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(1);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(nextPage);
  };

  if (loading && page === 1) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading satirical news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16 mb-12 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full animate-pulse delay-150"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full animate-bounce delay-300"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
              <Newspaper className="w-16 h-16 animate-bounce" />
              <h1 className="text-6xl font-extrabold tracking-tight animate-slide-up">jokePatra</h1>
            </div>
            <p className="text-2xl font-light mb-2 text-orange-100 animate-fade-in-delay-1">
              Nepal's Premier Satirical News Platform
            </p>
            <p className="text-lg text-orange-200 max-w-2xl mx-auto animate-fade-in-delay-2">
              Where AI meets humor, and reality takes a coffee break ☕
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-orange-100 animate-fade-in-delay-3">
              <span className="px-3 py-1 bg-white/20 rounded-full hover:bg-white/30 transition-all hover:scale-105 cursor-pointer">100% Satirical</span>
              <span className="px-3 py-1 bg-white/20 rounded-full hover:bg-white/30 transition-all hover:scale-105 cursor-pointer">AI-Powered</span>
              <span className="px-3 py-1 bg-white/20 rounded-full hover:bg-white/30 transition-all hover:scale-105 cursor-pointer">Daily Updates</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {articles.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            No Articles Yet
          </h2>
          <p className="text-gray-600">
            Check back soon for fresh satirical content!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {articles.map((article, index) => (
              <div 
                key={article.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ArticleCard article={article} />
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center animate-fade-in">
              <Button
                onClick={loadMore}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Loading More...
                  </>
                ) : (
                  'Load More Articles →'
                )}
              </Button>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
}
