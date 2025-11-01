# jokePatra Setup Guide

This guide will walk you through setting up jokePatra from scratch.

## Prerequisites

Before you begin, make sure you have:
- Node.js 18 or higher installed
- npm or yarn package manager
- A Supabase account (free tier works great)
- A Google account for Gemini API access

## Step 1: Get Supabase Credentials

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to finish setting up (usually takes 2-3 minutes)
4. Go to **Project Settings > API**
5. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## Step 2: Get Google Gemini API Key (FREE)

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy your API key

**Important:** This is completely free! No credit card or payment required.

## Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and replace the placeholders:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-supabase

GEMINI_API_KEY=your-gemini-api-key-from-google

JWT_SECRET=your-random-secret-string-at-least-32-characters

CRON_SECRET=another-random-secret-for-cron-jobs
```

**Generate secure secrets:**
```bash
# For JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# For CRON_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 4: Set Up the Database

The database schema is already created through the Supabase MCP integration. The following tables exist:

- **articles** - Stores all satirical news articles
- **users** - Admin user accounts

Both tables have Row Level Security (RLS) enabled for security.

## Step 5: Create an Admin User

Run the admin creation script:

```bash
npx tsx scripts/create-admin.ts
```

This creates an admin user with:
- **Email:** `admin@jokepatra.com`
- **Password:** `changeme123`

**Important:** Change this password immediately after first login!

To use a custom email/password:
```bash
ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpassword npx tsx scripts/create-admin.ts
```

## Step 6: Install Dependencies

```bash
npm install
```

## Step 7: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site!

## Step 8: Test the Application

### Test Public Site
1. Visit `http://localhost:3000`
2. You should see the homepage (no articles yet)

### Test Admin Login
1. Go to `http://localhost:3000/admin`
2. Login with your admin credentials
3. You should see the admin dashboard

### Generate Your First Article
1. In the admin dashboard, enter a custom prompt:
   ```
   Write a sarcastic article about Kathmandu traffic being so slow that people started farming vegetables on the roads while stuck in jams.
   ```
2. Click "Generate Article"
3. Wait 10-20 seconds for the AI to generate content
4. Go back to the homepage to see your article!

## Production Deployment

### Deploy to Vercel

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

2. Go to [Vercel](https://vercel.com) and import your repository

3. Add environment variables in Vercel:
   - Go to Project Settings > Environment Variables
   - Add all variables from your `.env.local` file

4. Deploy!

### Set Up Daily Cron Job

#### Option 1: Vercel Cron (Recommended)

Create `vercel.json` in your project root:

```json
{
  "crons": [{
    "path": "/api/cron/daily-news",
    "schedule": "0 7 * * *"
  }]
}
```

Push to deploy, and Vercel will automatically run it daily at 7 AM UTC.

#### Option 2: External Cron Service

Use services like:
- [cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)
- [GitHub Actions](https://github.com/features/actions)

Set it to call:
```
GET https://your-domain.com/api/cron/daily-news
Header: Authorization: Bearer YOUR_CRON_SECRET
```

## Troubleshooting

### "Supabase environment variables are not configured"

Make sure your `.env.local` file exists and has valid Supabase credentials.

### "Failed to generate satirical news"

1. Check if your Gemini API key is valid
2. Verify you have internet connectivity
3. Check if you've hit API rate limits (unlikely on free tier)

### "Invalid credentials" on admin login

1. Make sure you ran the create-admin script
2. Check if the user exists in Supabase:
   - Go to Supabase Dashboard > Table Editor > users
   - You should see your admin user

### Build errors

If you get build errors related to Supabase, make sure all environment variables are properly set before building.

## Customization

### Change AI Prompt Style

Edit `lib/gemini.ts` to modify the default prompt template and adjust:
- Tone and style
- Topics and focus areas
- Output format
- Language preferences

### Modify Styling

All styles use Tailwind CSS. Key files:
- `tailwind.config.ts` - Theme configuration
- `app/globals.css` - Global styles
- Component files - Component-specific styles

### Add New Features

The codebase is modular:
- `/app` - Pages and layouts
- `/components` - Reusable UI components
- `/lib` - Utilities and services
- `/app/api` - API routes

## Security Checklist for Production

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Use strong CRON_SECRET
- [ ] Enable Supabase RLS policies (already done)
- [ ] Set up rate limiting for API routes
- [ ] Enable HTTPS only
- [ ] Review and update CORS settings
- [ ] Monitor API usage and costs
- [ ] Set up error tracking (Sentry, etc.)

## Support

If you encounter issues:
1. Check this setup guide
2. Review the main README.md
3. Check Supabase and Gemini API status pages
4. Open an issue on GitHub

## Next Steps

Once everything is working:
1. Generate a few satirical articles
2. Customize the AI prompts for your style
3. Set up daily automation
4. Share with friends and enjoy the satire!

---

Happy satirizing! 🎭
