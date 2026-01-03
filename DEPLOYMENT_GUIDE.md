# 🚀 DAYFLOW HRMS - Live Demo Deployment Guide

## Overview
This guide will help you deploy your HRMS application to generate a live demo link. We'll use Railway for the backend + database and Vercel for the frontend.

## 📋 Prerequisites
1. GitHub account
2. Railway account (sign up at railway.app)
3. Vercel account (sign up at vercel.com)

## 🎯 Deployment Strategy
- **Backend + Database**: Railway (provides MySQL database and Node.js hosting)
- **Frontend**: Vercel (optimized for React/Vite apps)

---

## Part 1: Database & Backend Deployment (Railway)

### Step 1: Push Your Code to GitHub
```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin ashok-dev
```

### Step 2: Railway Setup
1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your HRMS repository
5. Select the `backend` folder as the root directory

### Step 3: Add MySQL Database
1. In your Railway project, click "New Service"
2. Select "Database" → "MySQL"
3. Railway will automatically create the database

### Step 4: Configure Environment Variables
In Railway dashboard, go to your backend service → Variables tab:

```env
NODE_ENV=production
JWT_SECRET=your_secure_jwt_secret_here
FRONTEND_URL=https://your-frontend-app.vercel.app
```

Railway will automatically provide:
- `DATABASE_URL` (complete MySQL connection string)
- `PORT` (auto-assigned)

### Step 5: Deploy Backend
1. Railway will automatically deploy when you push to GitHub
2. Your backend will be available at: `https://your-app-name.railway.app`

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Production
Update your frontend API configuration:

```javascript
// src/services/api.js or where you define API base URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-app.railway.app/api'
  : 'http://localhost:5000/api';
```

### Step 2: Create Build Configuration
Create/update `vite.config.js` in your frontend:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  preview: {
    port: 3000
  }
})
```

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your HRMS repository
4. Set Root Directory to: `human-resource` (your frontend folder)
5. Framework: Vite
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Click "Deploy"

### Step 4: Update Environment Variables
In Vercel dashboard → Settings → Environment Variables:

```env
VITE_API_URL=https://your-backend-app.railway.app/api
```

---

## Part 3: Final Configuration

### Step 1: Update CORS Settings
Update your backend CORS configuration with the Vercel URL:

In Railway → Environment Variables, update:
```env
FRONTEND_URL=https://your-frontend-app.vercel.app
```

### Step 2: Test Your Live Demo
1. Frontend: `https://your-app-name.vercel.app`
2. Backend: `https://your-backend-name.railway.app`

---

## 🎉 Your Live Demo Links

Once deployed, you'll have:

### 🌐 **Frontend (User Interface)**
`https://dayflow-hrms.vercel.app`

### 🔧 **Backend API**
`https://dayflow-backend.railway.app`

### 📊 **Demo Features Available**
- ✅ User Registration & Login
- ✅ Dashboard Interface
- ✅ Leave Management
- ✅ Employee Profile Management
- ✅ Admin Panel
- ✅ Attendance Tracking

---

## 🚨 Quick Deployment Commands

If you want to deploy right now, run these commands:

```bash
# 1. Commit all changes
git add .
git commit -m "Ready for deployment"
git push origin ashok-dev

# 2. Create production branch
git checkout -b production
git push origin production
```

Then follow the Railway and Vercel setup steps above.

---

## 📞 Support
If you encounter any issues during deployment, the main areas to check:
1. Environment variables are correctly set
2. Database connection is established
3. CORS is configured for your frontend URL
4. API endpoints are updated for production

Your HRMS app is production-ready! 🎯