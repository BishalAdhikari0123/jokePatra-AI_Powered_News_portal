'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Article } from '@/lib/types';
import { ArticleDialog } from '@/components/ArticleDialog';
import { DeleteDialog } from '@/components/DeleteDialog';
import { ImageUpload } from '@/components/ImageUpload';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sparkles,
  Loader2,
  Trash2,
  LogOut,
  Calendar,
  Tag,
  Lock,
  Eye,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [prompt, setPrompt] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [shouldPublish, setShouldPublish] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [token, setToken] = useState('');
  
  // Article dialog state
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articleDialogOpen, setArticleDialogOpen] = useState(false);
  
  // Delete dialog state
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      fetchArticles(savedToken);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.data.token);
        setToken(data.data.token);
        setIsLoggedIn(true);
        fetchArticles(data.data.token);
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch (err) {
      setLoginError('Failed to connect to server');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setIsLoggedIn(false);
    setArticles([]);
  };

  const fetchArticles = async (authToken: string) => {
    setLoadingArticles(true);
    try {
      const response = await fetch('/api/admin/articles', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await response.json();

      if (data.success) {
        setArticles(data.data.articles);
      }
    } catch (err) {
      console.error('Failed to fetch articles');
    } finally {
      setLoadingArticles(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setGenerateError('');

    try {
      const response = await fetch('/api/admin/articles/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          prompt, 
          publish: shouldPublish,
          featured_image: featuredImageUrl || undefined
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPrompt('');
        setFeaturedImageUrl('');
        setShouldPublish(false);
        fetchArticles(token);
        alert(data.message || 'Article generated successfully');
      } else {
        setGenerateError(data.error || 'Generation failed');
      }
    } catch (err) {
      setGenerateError('Failed to generate article');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/articles?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        fetchArticles(token);
        setDeleteDialogOpen(false);
        setArticleToDelete(null);
      }
    } catch (err) {
      console.error('Failed to delete article');
    }
  };

  const handleDeleteClick = (article: Article) => {
    setArticleToDelete(article);
    setDeleteDialogOpen(true);
  };

  const handleTogglePublish = async (id: string, currentlyPublished: boolean) => {
    try {
      const response = await fetch('/api/admin/articles/publish', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, publish: !currentlyPublished }),
      });

      const data = await response.json();

      if (data.success) {
        fetchArticles(token);
        alert(data.message);
      }
    } catch (err) {
      console.error('Failed to toggle publish status');
    }
  };

  const handleViewArticle = (article: Article) => {
    setSelectedArticle(article);
    setArticleDialogOpen(true);
  };

  const handleArticleSaved = (updatedArticle: Article) => {
    setArticles(
      articles.map((a) => (a.id === updatedArticle.id ? updatedArticle : a))
    );
    fetchArticles(token);
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[80vh] animate-fade-in">
        <Card className="w-full max-w-md animate-fade-in-up shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Admin Login
            </CardTitle>
            <CardDescription>
              Sign in to manage satirical articles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@jokepatra.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {loginError && (
                <p className="text-sm text-red-600">{loginError}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8 animate-slide-down">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout} className="transition-all duration-300 hover:scale-105">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card className="border-orange-200 animate-fade-in-up shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-600 animate-pulse" />
              Generate Satirical Article
            </CardTitle>
            <CardDescription>
              Provide a custom prompt to generate AI-powered satirical news
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <Label htmlFor="prompt">Custom Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Write a sarcastic article about Nepal's power outage turning into a national meditation event..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  required
                  minLength={10}
                  maxLength={2000}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {prompt.length} / 2000 characters
                </p>
              </div>
              
              {/* Image Upload Component */}
              <ImageUpload 
                value={featuredImageUrl}
                onChange={setFeaturedImageUrl}
                onClear={() => setFeaturedImageUrl('')}
              />

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="publish"
                  checked={shouldPublish}
                  onCheckedChange={(checked) => setShouldPublish(checked as boolean)}
                />
                <Label
                  htmlFor="publish"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Publish immediately after generation
                </Label>
              </div>
              {generateError && (
                <p className="text-sm text-red-600">{generateError}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={generating}
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Article
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-orange-200 animate-fade-in-up shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg transition-all duration-300 hover:bg-orange-100 hover:scale-105">
                <span className="font-semibold">Total Articles</span>
                <span className="text-2xl font-bold text-orange-600">
                  {articles.length}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:scale-105">
                <span className="font-semibold">Published</span>
                <span className="text-2xl font-bold">
                  {articles.filter((a) => a.published_at).length}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg transition-all duration-300 hover:bg-yellow-100 hover:scale-105">
                <span className="font-semibold">Drafts</span>
                <span className="text-2xl font-bold text-yellow-600">
                  {articles.filter((a) => !a.published_at).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Articles</CardTitle>
          <CardDescription>Manage your satirical content</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingArticles ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto" />
            </div>
          ) : articles.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No articles yet. Generate your first one!
            </p>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        {article.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(article.created_at).toLocaleDateString()}
                        </span>
                        {article.published_at && (
                          <Badge variant="secondary" className="bg-green-100">
                            Published
                          </Badge>
                        )}
                        {!article.published_at && (
                          <Badge variant="secondary" className="bg-yellow-100">
                            Draft
                          </Badge>
                        )}
                      </div>
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {article.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewArticle(article)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View/Edit
                      </Button>
                      <Button
                        variant={article.published_at ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleTogglePublish(article.id, !!article.published_at)}
                        className={article.published_at ? "" : "bg-green-600 hover:bg-green-700"}
                      >
                        {article.published_at ? "Unpublish" : "Publish"}
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteClick(article)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Article View/Edit Dialog */}
      <ArticleDialog
        article={selectedArticle}
        open={articleDialogOpen}
        onOpenChange={setArticleDialogOpen}
        onSave={handleArticleSaved}
        token={token}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        article={articleToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => articleToDelete && handleDelete(articleToDelete.id)}
      />
    </div>
  );
}
