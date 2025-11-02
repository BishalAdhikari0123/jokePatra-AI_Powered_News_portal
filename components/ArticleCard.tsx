import Link from 'next/link';
import { Article } from '@/lib/types';
import { Calendar, Tag, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unpublished';

  return (
    <Link href={`/news/${article.slug}`}>
      <Card className="group h-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-orange-400 animate-fade-in-up">
        {/* Featured Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200">
          {article.featured_image ? (
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-orange-300 transition-transform duration-300 group-hover:scale-110" />
            </div>
          )}
          {/* Satire Badge Overlay */}
          <div className="absolute top-3 left-3 transition-transform duration-300 group-hover:scale-110">
            <Badge className="bg-orange-600 text-white border-none shadow-lg">
              SATIRE
            </Badge>
          </div>
        </div>

        <CardContent className="p-5">
          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 transition-colors duration-300 group-hover:text-orange-600">
            <Calendar className="w-3.5 h-3.5" />
            <span>{publishedDate}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold leading-tight mb-3 line-clamp-2 transition-all duration-300 group-hover:text-orange-600 group-hover:translate-x-1">
            {article.title}
          </h3>

          {/* Summary */}
          {article.summary && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {article.summary}
            </p>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {article.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  <Tag className="w-2.5 h-2.5 mr-1" />
                  {tag}
                </Badge>
              ))}
              {article.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{article.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
