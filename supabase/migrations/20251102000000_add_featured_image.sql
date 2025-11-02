-- Add featured_image column to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_image text;

-- Add comment
COMMENT ON COLUMN articles.featured_image IS 'URL to the featured/cover image for the article';
