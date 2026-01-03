#!/bin/bash

# Dayflow HRMS - Quick Deployment Setup Script
echo "🚀 Dayflow HRMS - Render Deployment Setup"
echo "=========================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Dayflow HRMS"
fi

# Check for remote
if ! git remote | grep -q 'origin'; then
    echo "❓ Enter your GitHub repository URL:"
    read repo_url
    git remote add origin $repo_url
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Go to https://render.com and sign in"
echo "2. Set up PlanetScale MySQL database (https://planetscale.com)"
echo "3. Create Backend Web Service on Render"
echo "4. Create Frontend Static Site on Render"
echo "5. Configure environment variables"
echo ""
echo "📖 See RENDER_DEPLOYMENT_GUIDE.md for detailed instructions"
