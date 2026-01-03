#!/bin/bash

echo "🚀 DAYFLOW HRMS - Quick Deployment Setup"
echo "========================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: This is not a git repository"
    echo "Run 'git init' first"
    exit 1
fi

echo "📦 Preparing deployment..."

# Add all changes
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Prepare for production deployment - $(date '+%Y-%m-%d %H:%M:%S')"

# Push to current branch
echo "📤 Pushing to GitHub..."
git push origin $(git branch --show-current)

# Create production branch if it doesn't exist
if ! git rev-parse --verify production >/dev/null 2>&1; then
    echo "🌿 Creating production branch..."
    git checkout -b production
    git push origin production
    git checkout $(git branch --show-current)
else
    echo "🌿 Production branch already exists"
fi

echo ""
echo "✅ Repository is ready for deployment!"
echo ""
echo "🎯 Next Steps:"
echo "1. Go to railway.app and deploy your backend"
echo "2. Go to vercel.com and deploy your frontend"  
echo "3. Update the API URLs in your production files"
echo ""
echo "📚 Check DEPLOYMENT_GUIDE.md for detailed instructions"