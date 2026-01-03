@echo off
REM Dayflow HRMS - Quick Deployment Setup Script for Windows
echo.
echo 🚀 Dayflow HRMS - Render Deployment Setup
echo ==========================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit - Dayflow HRMS"
)

REM Check for remote
git remote | findstr "origin" >nul
if errorlevel 1 (
    set /p repo_url="❓ Enter your GitHub repository URL: "
    git remote add origin %repo_url%
)

REM Push to GitHub
echo 📤 Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ✅ Setup Complete!
echo.
echo Next steps:
echo 1. Go to https://render.com and sign in
echo 2. Set up PlanetScale MySQL database (https://planetscale.com)
echo 3. Create Backend Web Service on Render
echo 4. Create Frontend Static Site on Render
echo 5. Configure environment variables
echo.
echo 📖 See RENDER_DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause
