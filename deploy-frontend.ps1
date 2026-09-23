# Deploy Frontend to Vercel
Write-Host "🚀 Deploying Frontend to Vercel..." -ForegroundColor Cyan
Write-Host ""

# Get backend URL
$backendUrl = Read-Host "Enter your BACKEND URL (from previous deployment)"

# Set environment variable
$env:REACT_APP_API_URL = "$backendUrl/api"

cd frontend

Write-Host ""
Write-Host "⚙️ Deploying frontend..." -ForegroundColor Yellow

# Deploy to production
vercel --prod

Write-Host ""
Write-Host "✅ Frontend deployed!" -ForegroundColor Green
Write-Host "Your website is now live!" -ForegroundColor Cyan
