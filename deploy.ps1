# Clothify Deployment Script
Write-Host "🚀 Clothify Deployment Helper" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git already initialized" -ForegroundColor Green
}

# Add all files
Write-Host ""
Write-Host "📁 Adding files to Git..." -ForegroundColor Yellow
git add .

# Commit
Write-Host ""
Write-Host "💾 Creating commit..." -ForegroundColor Yellow
git commit -m "Deploy Clothify to Vercel"

Write-Host ""
Write-Host "✅ Ready to push!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create a GitHub repository: https://github.com/new" -ForegroundColor White
Write-Host "2. Run these commands:" -ForegroundColor White
Write-Host ""
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/clothify-ecommerce.git" -ForegroundColor Yellow
Write-Host "   git branch -M main" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Go to Vercel: https://vercel.com/" -ForegroundColor White
Write-Host "4. Import your repository and follow DEPLOYMENT.md" -ForegroundColor White
Write-Host ""
Write-Host "📖 Full instructions: See DEPLOYMENT.md" -ForegroundColor Cyan
