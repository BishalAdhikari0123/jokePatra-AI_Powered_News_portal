# 📸 Cloudinary Image Upload Setup

## Overview
jokePatra now uses Cloudinary for image uploads instead of manual URL entry. Users can upload images directly from their device, and they're automatically optimized and stored on Cloudinary.

## Features Implemented

### 1. Image Upload Component (`components/ImageUpload.tsx`)
- **Drag & Drop Zone**: Click to upload interface
- **File Validation**: 
  - Only image files accepted (PNG, JPG, GIF, etc.)
  - Maximum file size: 5MB
- **Live Preview**: Shows uploaded image with hover effects
- **Remove Functionality**: Clear uploaded image
- **Loading States**: Shows spinner during upload
- **Error Handling**: Displays user-friendly error messages

### 2. Upload API Route (`app/api/upload/route.ts`)
- **Automatic Optimization**:
  - Max dimensions: 1200x630px
  - Auto quality adjustment
  - Auto format conversion (WebP when supported)
- **Organized Storage**: Images stored in `jokepatra` folder on Cloudinary
- **Secure Upload**: Server-side processing with API secrets

### 3. Integration Points

#### Admin Dashboard
- Replace URL input with ImageUpload component
- Upload images when generating new articles
- Works with both "Generate" and manual article creation

#### Article Dialog (Edit Mode)
- Upload/change featured images when editing articles
- View mode shows current image
- Edit mode allows uploading new image

## Configuration

### Environment Variables (`.env`)
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dtfdnvuvm
CLOUDINARY_API_KEY=451868945211344
CLOUDINARY_API_SECRET=JYz9qcR1e-oNQL7kh8gArDYPuJY
```

### Vercel Deployment
When deploying to Vercel, add these environment variables:
1. Go to Project Settings → Environment Variables
2. Add the three Cloudinary variables above
3. Redeploy for changes to take effect

## How It Works

### Upload Flow:
1. **User Action**: Click upload button or drop zone
2. **File Selection**: Browser opens file picker
3. **Client Validation**: Check file type and size
4. **Upload to API**: Send file via FormData to `/api/upload`
5. **Server Processing**: 
   - Convert to base64
   - Upload to Cloudinary with transformations
   - Return secure URL
6. **Update State**: Store Cloudinary URL in component state
7. **Database**: URL saved when article is generated/updated

### Image Transformations:
```javascript
{
  width: 1200,
  height: 630,
  crop: 'limit',        // Maintain aspect ratio
  quality: 'auto',      // Automatic quality optimization
  fetch_format: 'auto'  // Serve WebP when supported
}
```

## Usage Examples

### In Admin Dashboard:
```tsx
<ImageUpload 
  value={featuredImageUrl}
  onChange={setFeaturedImageUrl}
  onClear={() => setFeaturedImageUrl('')}
/>
```

### In Article Dialog:
```tsx
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
  // View mode - show image
)}
```

## Benefits

### For Users:
- ✅ No need to find and copy image URLs
- ✅ Upload directly from device/camera
- ✅ Instant preview
- ✅ Better UX with drag & drop

### For Application:
- ✅ Optimized images (faster load times)
- ✅ Automatic format conversion (WebP support)
- ✅ CDN delivery (global performance)
- ✅ Centralized image management
- ✅ Automatic compression

### For Performance:
- ✅ Images served from Cloudinary CDN
- ✅ Auto-optimized for different devices
- ✅ Lazy loading support
- ✅ Reduced bandwidth usage

## File Structure
```
app/
  api/
    upload/
      route.ts          # Cloudinary upload endpoint

components/
  ImageUpload.tsx       # Reusable upload component
  ArticleDialog.tsx     # Updated to use ImageUpload
  
app/
  admin/
    page.tsx           # Updated to use ImageUpload
```

## Testing

### Test Upload:
1. Go to Admin Dashboard (http://localhost:3001/admin)
2. Login with admin credentials
3. In "Generate Satirical Article" section:
   - Click "Upload Image" button
   - Select an image from your device
   - Watch it upload and preview
   - Generate article - image URL will be included

### Test Edit:
1. View existing article with "View/Edit" button
2. Click "Edit" tab
3. Upload new featured image
4. Save changes
5. Verify image updates in article list

## Cloudinary Dashboard

Access your images at:
- Dashboard: https://cloudinary.com/console
- Folder: `jokepatra/`
- All uploaded images are stored here
- You can manage, transform, or delete images

## Troubleshooting

### Upload Fails:
- Check internet connection
- Verify Cloudinary credentials in `.env`
- Check browser console for errors
- Ensure file is under 5MB and valid image format

### Image Not Displaying:
- Check Cloudinary URL in browser
- Verify CORS settings in Cloudinary
- Check network tab for 404/403 errors

### Slow Uploads:
- Large file size (compress before upload)
- Slow internet connection
- Cloudinary API latency (rare)

## Future Enhancements
- [ ] Multiple image upload support
- [ ] Image cropping/editing before upload
- [ ] Gallery view of all uploaded images
- [ ] Bulk image management
- [ ] Image search functionality
- [ ] Generate AI images for articles
