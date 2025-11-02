'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Loader2, X, ImageIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onClear?: () => void;
}

export function ImageUpload({ value, onChange, onClear }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onChange(data.url);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClearImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="space-y-4">
      <Label>Featured Image</Label>
      
      {/* Upload Button */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload Image
            </>
          )}
        </Button>

        {value && (
          <Button
            type="button"
            variant="outline"
            onClick={handleClearImage}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4" />
            Remove
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Image Preview */}
      {value && (
        <div className="relative w-full h-64 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden group">
          <img
            src={value}
            alt="Featured preview"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleClearImage}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <X className="w-4 h-4 mr-2" />
              Remove Image
            </Button>
          </div>
        </div>
      )}

      {/* Upload Area (when no image) */}
      {!value && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-64 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all duration-300"
        >
          <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">Click to upload image</p>
          <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
        </div>
      )}
    </div>
  );
}
