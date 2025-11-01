/*
  # jokePatra Database Schema

  ## Overview
  Creates the core database structure for jokePatra - a satirical Nepali news platform.

  ## New Tables
  
  ### `articles`
  Stores all satirical news articles (both auto-generated and manually created)
  - `id` (uuid, primary key) - Unique article identifier
  - `title` (text) - Article headline
  - `slug` (text, unique) - URL-friendly identifier
  - `summary` (text) - Brief article summary
  - `content` (text) - Full HTML content of the article
  - `tags` (text[]) - Array of topic tags
  - `language` (text) - Content language (en/ne)
  - `satire` (boolean) - Mark as satirical content
  - `published_at` (timestamptz) - Publication timestamp
  - `source` (text) - Content source (e.g., "Gemini 1.5 Flash")
  - `prompt_used` (text) - AI prompt used for generation
  - `author_id` (uuid, foreign key) - Reference to users table
  - `created_at` (timestamptz) - Record creation time
  - `updated_at` (timestamptz) - Last update time

  ### `users`
  Admin users who can manage content and generate articles
  - `id` (uuid, primary key) - Unique user identifier
  - `email` (text, unique) - User email for login
  - `password` (text) - Hashed password
  - `role` (text) - User role (default: admin)
  - `created_at` (timestamptz) - Account creation time

  ## Security
  - Enable RLS on both tables
  - Articles: Public read access, authenticated write
  - Users: No public access, authenticated admin only

  ## Important Notes
  1. All articles are marked as satirical by default
  2. Passwords must be hashed before storage
  3. RLS ensures data security and proper access control
*/

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  summary text,
  content text NOT NULL,
  tags text[] DEFAULT '{}',
  language text DEFAULT 'en',
  satire boolean DEFAULT true,
  published_at timestamptz,
  source text,
  prompt_used text,
  author_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'articles_author_id_fkey'
  ) THEN
    ALTER TABLE articles ADD CONSTRAINT articles_author_id_fkey 
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS articles_published_at_idx ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS articles_slug_idx ON articles(slug);
CREATE INDEX IF NOT EXISTS articles_tags_idx ON articles USING GIN(tags);
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for articles table

-- Public can read published articles
CREATE POLICY "Anyone can view published articles"
  ON articles FOR SELECT
  USING (published_at IS NOT NULL);

-- Authenticated users can insert articles
CREATE POLICY "Authenticated users can create articles"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update articles
CREATE POLICY "Authenticated users can update articles"
  ON articles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete articles
CREATE POLICY "Authenticated users can delete articles"
  ON articles FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for users table

-- Authenticated users can read their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Only authenticated users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
