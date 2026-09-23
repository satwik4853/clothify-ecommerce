# Deploy Backend to Vercel
Write-Host "🚀 Deploying Backend to Vercel..." -ForegroundColor Cyan
Write-Host ""

cd backend

# Login to Vercel (will open browser)
Write-Host "📝 Please login to Vercel in your browser..." -ForegroundColor Yellow
vercel login

Write-Host ""
Write-Host "⚙️ Deploying backend..." -ForegroundColor Yellow

# Deploy to production
vercel --prod

Write-Host ""
Write-Host "✅ Backend deployed!" -ForegroundColor Green
Write-Host "Copy the URL shown above and use it in frontend deployment" -ForegroundColor Cyan
