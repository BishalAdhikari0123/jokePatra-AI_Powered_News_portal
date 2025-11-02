'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Article } from '@/lib/types';
import { Calendar, Tag, Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/articles/${slug}`);
        const data = await response.json();

        if (data.success) {
          setArticle(data.data);
        } else {
          setError(data.error || 'Article not found');
        }
      } catch (err) {
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600 mb-4">{error}</p>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Unpublished';

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header with Back Button */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-8 animate-slide-down">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white mb-4 transition-all duration-300 hover:scale-105">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <article className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
            {/* Featured Image */}
            {article.featured_image && (
              <div className="relative h-96 overflow-hidden group">
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 transition-transform duration-300 hover:scale-110">
                  <Badge className="bg-orange-600 text-white border-none shadow-lg text-sm px-4 py-1">
                    🎭 SATIRE
                  </Badge>
                </div>
              </div>
            )}

            <div className="p-8 md:p-12">
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6 animate-fade-in">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{publishedDate}</span>
                </div>
                {article.source && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                      <span className="text-orange-600 font-medium">{article.source}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6 animate-fade-in-delay-1">
                {article.title}
              </h1>

              {/* Summary */}
              {article.summary && (
                <p className="text-xl text-gray-600 mb-8 leading-relaxed italic border-l-4 border-orange-400 pl-6 py-2 bg-orange-50 animate-fade-in-delay-2">
                  {article.summary}
                </p>
              )}

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8 animate-fade-in-delay-3">
                  {article.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-sm bg-orange-100 text-orange-800 hover:bg-orange-200 transition-all duration-300 hover:scale-110"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Disclaimer */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-xl p-5 mb-8">
                <p className="text-sm text-orange-900 font-semibold text-center flex items-center justify-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  <span>Satirical Content: This article is fictional and created for entertainment purposes only.</span>
                </p>
              </div>

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none 
                  prose-headings:text-gray-900 prose-headings:font-bold
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-orange-600 prose-a:font-medium hover:prose-a:text-orange-700
                  prose-strong:text-gray-900 prose-strong:font-bold
                  prose-blockquote:border-l-orange-500 prose-blockquote:bg-orange-50 prose-blockquote:py-2
                  prose-ul:my-4 prose-ol:my-4
                  prose-li:text-gray-700"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </article>

          {/* Bottom CTA */}
          <div className="mt-12 text-center bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Want More Laughs?</h3>
            <p className="text-gray-600 mb-6">Discover more satirical news from Nepal's premier fake news outlet!</p>
            <Link href="/">
              <Button className="bg-orange-600 hover:bg-orange-700 px-8 py-6 text-lg rounded-full shadow-lg">
                📰 Read More Satirical News
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
