-- Add featured_image column to articles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'articles' 
        AND column_name = 'featured_image'
    ) THEN
        ALTER TABLE articles ADD COLUMN featured_image text;
        COMMENT ON COLUMN articles.featured_image IS 'URL to the featured/cover image for the article';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'articles' AND column_name = 'featured_image';
