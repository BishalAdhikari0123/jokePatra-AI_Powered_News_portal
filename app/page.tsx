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
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Newspaper className="w-12 h-12 text-orange-600" />
          <h1 className="text-5xl font-bold text-gray-900">jokePatra</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Nepal's most sarcastic daily news platform. Where AI meets humor, and
          reality takes a coffee break.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16">
          <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {hasMore && (
            <div className="text-center">
              <Button
                onClick={loadMore}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Articles'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
