@echo off
echo 🚀 DAYFLOW HRMS - Quick Deployment Setup
echo ========================================

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Error: This is not a git repository
    echo Run 'git init' first
    pause
    exit /b 1
)

echo 📦 Preparing deployment...

REM Add all changes
git add .

REM Commit changes
echo 💾 Committing changes...
git commit -m "Prepare for production deployment - %date% %time%"

REM Get current branch
for /f "tokens=*" %%i in ('git branch --show-current') do set current_branch=%%i

REM Push to current branch
echo 📤 Pushing to GitHub...
git push origin %current_branch%

REM Check if production branch exists
git rev-parse --verify production >nul 2>&1
if errorlevel 1 (
    echo 🌿 Creating production branch...
    git checkout -b production
    git push origin production
    git checkout %current_branch%
) else (
    echo 🌿 Production branch already exists
)

echo.
echo ✅ Repository is ready for deployment!
echo.
echo 🎯 Next Steps:
echo 1. Go to railway.app and deploy your backend
echo 2. Go to vercel.com and deploy your frontend  
echo 3. Update the API URLs in your production files
echo.
echo 📚 Check DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause