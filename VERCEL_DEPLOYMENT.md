# Vercel Deployment Checklist

## Required Environment Variables

You MUST add these environment variables in Vercel for the app to work:

### 1. Go to Vercel Dashboard
https://vercel.com/dashboard → Your Project → Settings → Environment Variables

### 2. Add These Variables:

#### Supabase Configuration (REQUIRED)
```
NEXT_PUBLIC_SUPABASE_URL=https://bvkptubgznyahhtdkipp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2a3B0dWJnem55YWhodGRraXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5OTE5MjAsImV4cCI6MjA3NzU2NzkyMH0.CJHcOkTy9NOxlJ3w96gfko4VMJAx7g0doP3OQdwihFs
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2a3B0dWJnem55YWhodGRraXBwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTk5MTkyMCwiZXhwIjoyMDc3NTY3OTIwfQ.sy2luZhJxDjCRlpz27UQcMWW4pAYPb-HcjHP2uSzYco
```

#### Admin Credentials (REQUIRED)
```
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=changeme123
```

#### Gemini API (REQUIRED)
```
GEMINI_API_KEY=AIzaSyA6xar2AKwTdT1hDmwGPr_YVKTp6ojaoYs
```

#### Cloudinary (REQUIRED for image uploads)
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dtfdnvuvm
CLOUDINARY_API_KEY=your_new_rotated_api_key
CLOUDINARY_API_SECRET=your_new_rotated_api_secret
```

**⚠️ IMPORTANT: Rotate your Cloudinary credentials before deploying!**

### 3. Apply to All Environments
- Make sure to select: **Production**, **Preview**, and **Development**
- Click "Save" after adding each variable

### 4. Redeploy
After adding all environment variables:
1. Go to Deployments tab
2. Click the three dots (...) on the latest deployment
3. Click "Redeploy"
4. Select "Use existing Build Cache" (faster)
5. Click "Redeploy"

## Database Setup

### Add featured_image Column
Before deploying, run this in Supabase SQL Editor:

```sql
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_image text;
```

Steps:
1. Go to https://supabase.com/dashboard/project/bvkptubgznyahhtdkipp
2. Click SQL Editor
3. Click "New query"
4. Paste the SQL above
5. Click Run

## Troubleshooting

### Error: "Cannot read properties of null (reading 'from')"
**Cause:** Missing environment variables in Vercel
**Solution:** 
1. Check all environment variables are added
2. Make sure they're applied to Production
3. Redeploy after adding variables

### Error: "Could not find the 'featured_image' column"
**Cause:** Database migration not run
**Solution:** Run the SQL command in Supabase (see Database Setup above)

### Images not uploading
**Cause:** Cloudinary credentials not set or invalid
**Solution:**
1. Rotate credentials at https://console.cloudinary.com/settings/security
2. Update Vercel environment variables
3. Redeploy

### Admin login not working
**Cause:** Admin user not created in database
**Solution:** Run create-admin script:
```bash
pnpm create-admin
```

## Verification

After deployment, verify:
1. ✅ Homepage loads and shows articles
2. ✅ Admin login works
3. ✅ Can generate articles
4. ✅ Can upload images
5. ✅ Articles display with featured images

## Common Issues

### Issue: 500 Internal Server Error
- Check Vercel Function Logs
- Verify all environment variables are set
- Check Supabase connection

### Issue: Environment variables not working
- Make sure variables are applied to Production
- Variables starting with `NEXT_PUBLIC_` are exposed to browser
- Other variables are server-side only
- Redeploy after changing variables

### Issue: Build succeeds but runtime fails
- This usually means environment variables are missing
- Check logs in Vercel → Your Project → Logs
- Look for "not initialized" or "missing environment" errors
