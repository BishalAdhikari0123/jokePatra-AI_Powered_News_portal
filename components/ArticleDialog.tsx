'use client';

import { useState, useEffect } from 'react';
import { Article } from '@/lib/types';
import { ImageUpload } from '@/components/ImageUpload';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Edit, Save, X, Upload, Image as ImageIcon } from 'lucide-react';

interface ArticleDialogProps {
  article: Article | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (article: Article) => void;
  token: string;
}

export function ArticleDialog({
  article,
  open,
  onOpenChange,
  onSave,
  token,
}: ArticleDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedArticle, setEditedArticle] = useState<Article | null>(null);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (article) {
      setEditedArticle({ ...article });
      setTagInput(article.tags.join(', '));
      setIsEditing(false);
    }
  }, [article]);

  const handleSave = async () => {
    if (!editedArticle) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/articles/${editedArticle.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editedArticle.title,
          slug: editedArticle.slug,
          summary: editedArticle.summary,
          content: editedArticle.content,
          tags: tagInput.split(',').map((t) => t.trim()).filter(Boolean),
          language: editedArticle.language,
          featured_image: editedArticle.featured_image,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsEditing(false);
        onSave?.(data.data);
        alert('Article updated successfully!');
      } else {
        alert('Failed to update article: ' + data.error);
      }
    } catch (error) {
      alert('Failed to update article');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (article) {
      setEditedArticle({ ...article });
      setTagInput(article.tags.join(', '));
    }
    setIsEditing(false);
  };

  if (!editedArticle) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Edit className="w-5 h-5" />
                  Edit Article
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5" />
                  View Article
                </>
              )}
            </DialogTitle>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
          <DialogDescription>
            {editedArticle.published_at ? (
              <Badge className="bg-green-100 text-green-800">Published</Badge>
            ) : (
              <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 mt-4">
            {/* Featured Image */}
            {isEditing ? (
              <ImageUpload 
                value={editedArticle.featured_image || ''}
                onChange={(url) => setEditedArticle({
                  ...editedArticle,
                  featured_image: url,
                })}
                onClear={() => setEditedArticle({
                  ...editedArticle,
                  featured_image: '',
                })}
              />
            ) : (
              <div>
                <Label>Featured Image</Label>
                {editedArticle.featured_image ? (
                  <div className="mt-2 relative w-full h-64 rounded-lg overflow-hidden border">
                    <img
                      src={editedArticle.featured_image}
                      alt={editedArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mt-2 flex items-center justify-center h-32 bg-gray-100 rounded-lg border-2 border-dashed">
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">No featured image</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="title">Title</Label>
              {isEditing ? (
                <Input
                  id="title"
                  value={editedArticle.title}
                  onChange={(e) =>
                    setEditedArticle({ ...editedArticle, title: e.target.value })
                  }
                  className="mt-1"
                />
              ) : (
                <h2 className="text-2xl font-bold mt-2">{editedArticle.title}</h2>
              )}
            </div>

            <div>
              <Label htmlFor="slug">Slug (URL)</Label>
              {isEditing ? (
                <Input
                  id="slug"
                  value={editedArticle.slug}
                  onChange={(e) =>
                    setEditedArticle({ ...editedArticle, slug: e.target.value })
                  }
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-muted-foreground mt-1">
                  /news/{editedArticle.slug}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="summary">Summary</Label>
              {isEditing ? (
                <Textarea
                  id="summary"
                  value={editedArticle.summary || ''}
                  onChange={(e) =>
                    setEditedArticle({ ...editedArticle, summary: e.target.value })
                  }
                  rows={2}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-gray-700">{editedArticle.summary}</p>
              )}
            </div>

            <div>
              <Label htmlFor="content">Content (HTML)</Label>
              {isEditing ? (
                <Textarea
                  id="content"
                  value={editedArticle.content}
                  onChange={(e) =>
                    setEditedArticle({ ...editedArticle, content: e.target.value })
                  }
                  rows={12}
                  className="mt-1 font-mono text-sm"
                />
              ) : (
                <div
                  className="mt-2 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: editedArticle.content }}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              {isEditing ? (
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="politics, satire, nepal"
                  className="mt-1"
                />
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {editedArticle.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Language</Label>
              <p className="mt-1 text-sm text-muted-foreground">
                {editedArticle.language === 'en' ? 'English' : 'Nepali'}
              </p>
            </div>

            <div>
              <Label>Source</Label>
              <p className="mt-1 text-sm text-muted-foreground">
                {editedArticle.source || 'N/A'}
              </p>
            </div>

            {editedArticle.prompt_used && (
              <div>
                <Label>Generation Prompt</Label>
                <p className="mt-1 text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                  {editedArticle.prompt_used}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Created</Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  {new Date(editedArticle.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <Label>Updated</Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  {new Date(editedArticle.updated_at).toLocaleString()}
                </p>
              </div>
            </div>

            {editedArticle.published_at && (
              <div>
                <Label>Published</Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  {new Date(editedArticle.published_at).toLocaleString()}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {isEditing && (
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {saving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
