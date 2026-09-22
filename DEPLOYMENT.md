# 🚀 Clothify Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free)
- MongoDB Atlas account (you already have this)

## Step 1: Push to GitHub

1. **Initialize Git in your project:**
   ```bash
   cd C:\Users\pansa\OneDrive\Desktop\Clothing
   git init
   git add .
   git commit -m "Initial commit - Clothify e-commerce"
   ```

2. **Create a GitHub repository:**
   - Go to https://github.com/new
   - Name: `clothify-ecommerce`
   - Make it Public or Private
   - Don't initialize with README (we already have code)
   - Click "Create repository"

3. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/clothify-ecommerce.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy Backend to Vercel

1. **Go to Vercel:** https://vercel.com/
2. **Sign up/Login** with GitHub
3. **Click "Add New Project"**
4. **Import your repository** `clothify-ecommerce`
5. **Configure project:**
   - Framework Preset: `Other`
   - Root Directory: `backend`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: `npm install`

6. **Add Environment Variables** (click "Environment Variables"):
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://ompansare103_db_user:XORgAxGsaixMRrtE@cluster0.rvoi03n.mongodb.net/clothify?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=clothify_super_secret_jwt_key_2024
   JWT_EXPIRE=30d
   NODE_ENV=production
   ```

7. **Click "Deploy"**
8. **Wait for deployment** (takes 2-3 minutes)
9. **Copy the backend URL** (e.g., `https://clothify-backend-xyz.vercel.app`)

## Step 3: Update CORS in Backend

After deploying backend, you need to update the CORS settings:

1. In `backend/server.js`, update the CORS configuration:
   ```javascript
   app.use(cors({
     origin: [
       'http://localhost:3000',
       'https://your-frontend-url.vercel.app'
     ],
     credentials: true,
   }));
   ```

2. Commit and push:
   ```bash
   git add backend/server.js
   git commit -m "Update CORS for production"
   git push
   ```

## Step 4: Deploy Frontend to Vercel

1. **Go back to Vercel Dashboard**
2. **Click "Add New Project"**
3. **Import the same repository**
4. **Configure project:**
   - Framework Preset: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

5. **Add Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-url.vercel.app/api
   ```
   (Replace with your actual backend URL from Step 2)

6. **Click "Deploy"**
7. **Wait for deployment** (takes 3-4 minutes)
8. **Your site is live!** 🎉

## Step 5: Update Frontend URL in Backend CORS

1. Copy your frontend URL from Vercel (e.g., `https://clothify-xyz.vercel.app`)
2. Update `backend/server.js` CORS with the actual frontend URL
3. Commit and push to trigger re-deployment

## Important Notes

⚠️ **Image Uploads:** Vercel's serverless functions don't persist files. For production, you should:
- Use Cloudinary for image storage
- Or use Vercel Blob Storage (paid)

For now, the existing product images will work, but admin uploads won't persist.

## Your Live URLs

After deployment, you'll have:
- **Frontend:** `https://clothify-[random].vercel.app`
- **Backend API:** `https://clothify-backend-[random].vercel.app`
- **Admin Panel:** `https://clothify-[random].vercel.app/admin/login`

## Admin Credentials
- Email: `admin@clothify.in`
- Password: `admin123`

## Test User Credentials
- Email: `test@example.com`
- Password: `test123`

## Troubleshooting

**If images don't load:**
- Check that REACT_APP_API_URL is set correctly
- Images are served from backend `/uploads` route

**If API calls fail:**
- Check CORS settings in backend
- Verify MongoDB connection string
- Check Vercel function logs

**If login doesn't work:**
- Clear browser localStorage
- Check JWT_SECRET is set in backend environment variables

## Need Help?

Check Vercel logs:
1. Go to your project in Vercel
2. Click "Deployments"
3. Click on latest deployment
4. Click "Functions" tab to see backend logs
