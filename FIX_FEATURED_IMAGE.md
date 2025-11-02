# Fix Featured Image Column Issue

## Problem
The `featured_image` column doesn't exist in your Supabase database, causing the error:
"Could not find the 'featured_image' column of 'articles' in the schema cache"

## Solution

### Option 1: Run SQL in Supabase Dashboard (RECOMMENDED)

1. Go to your Supabase project: https://supabase.com/dashboard/project/bvkptubgznyahhtdkipp
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy and paste this SQL:

```sql
-- Add featured_image column to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_image text;

-- Verify it was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'articles' AND column_name = 'featured_image';
```

5. Click **Run** or press `Ctrl+Enter`
6. You should see output showing the column was added

### Option 2: Use the SQL file provided

1. Open `add_featured_image.sql` in this directory
2. Copy all the content
3. Run it in Supabase SQL Editor (same steps as Option 1)

## Verify the Fix

After running the SQL:

1. Go back to your app: http://localhost:3001/admin
2. Try uploading an image again
3. Generate an article
4. The featured image should now work!

## What This Does

- Adds `featured_image` column to the `articles` table
- Makes it optional (nullable) - articles can exist without images
- Stores the Cloudinary URL as text

## Already Fixed in Code

✅ Validation allows optional featured_image
✅ API routes handle null/empty featured_image
✅ UI components work with or without images
✅ Image upload component is already optional

You just need to add the database column!
