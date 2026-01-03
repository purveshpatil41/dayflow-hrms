# 🚀 Render Deployment Guide for Dayflow HRMS

## Overview
This guide provides complete step-by-step instructions to deploy your HRMS application on Render with MySQL database.

---

## 📋 Prerequisites
1. GitHub account with your code pushed
2. Render account (sign up at https://render.com)
3. Gmail account for email notifications

---

## Part 1: Backend Deployment on Render

### Step 1: Create MySQL Database

1. **Go to Render Dashboard** → Click "New +" → Select "PostgreSQL" or use external MySQL
   
   **Note**: Render doesn't provide managed MySQL. You have 2 options:
   
   **Option A: Use External MySQL (Recommended)**
   - Use a free MySQL provider like:
     - **PlanetScale** (https://planetscale.com) - Free tier available
     - **Railway** (https://railway.app) - MySQL database
     - **Aiven** (https://aiven.io) - Free MySQL
   
   **Option B: Convert to PostgreSQL**
   - Modify your code to use PostgreSQL instead of MySQL
   - Change `mysql2` to `pg` in dependencies
   - Update dialect in config

   **For this guide, we'll use PlanetScale MySQL:**

2. **Setup PlanetScale Database:**
   - Go to https://planetscale.com and sign up
   - Create a new database: `dayflow_hrms`
   - Create a new password
   - Get connection details:
     - Host
     - Username
     - Password
     - Database name
     - Port (usually 3306)

### Step 2: Deploy Backend Service

1. **In Render Dashboard:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `dayflow-hrms`

2. **Configure Build Settings:**
   ```
   Name: dayflow-hrms-backend
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

3. **Set Environment Variables:**
   Click "Environment" tab and add:
   
   ```env
   NODE_ENV=production
   PORT=10000
   
   # Database Configuration (from PlanetScale)
   DB_HOST=your-planetscale-host.psdb.cloud
   DB_USER=your-username
   DB_PASSWORD=your-password
   DB_NAME=dayflow_hrms
   DB_DIALECT=mysql
   
   # JWT Configuration
   JWT_SECRET=dayflow_hrms_secure_jwt_secret_key_2026_hackathon_project
   JWT_EXPIRE=7d
   
   # Email Configuration (Gmail App Password)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=ashokkrsah19@gmail.com
   EMAIL_PASS=krlztcfbeyomnwmlv
   
   # Frontend URL (update after frontend deployment)
   FRONTEND_URL=https://dayflow-hrms.onrender.com
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete (5-10 minutes)
   - Your backend URL will be: `https://dayflow-hrms-backend.onrender.com`

5. **Test Backend:**
   - Visit: `https://dayflow-hrms-backend.onrender.com`
   - You should see:
     ```json
     {
       "success": true,
       "message": "Dayflow HRMS API is running",
       "version": "1.0.0",
       "database": "MySQL"
     }
     ```

---

## Part 2: Frontend Deployment on Render

### Step 1: Update Frontend Configuration

The frontend is already configured to use the Render backend URL in production mode.

### Step 2: Deploy Frontend Service

1. **In Render Dashboard:**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Select the repository: `dayflow-hrms`

2. **Configure Build Settings:**
   ```
   Name: dayflow-hrms
   Branch: main
   Root Directory: (leave empty or put '.')
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Set Environment Variables:**
   Click "Environment" tab and add:
   
   ```env
   VITE_API_URL=https://dayflow-hrms-backend.onrender.com
   ```

4. **Deploy:**
   - Click "Create Static Site"
   - Wait for deployment to complete (5-10 minutes)
   - Your frontend URL will be: `https://dayflow-hrms.onrender.com`

### Step 3: Update Backend CORS

1. Go back to your backend service in Render
2. Update the `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://dayflow-hrms.onrender.com
   ```
3. Click "Save Changes" (this will trigger a redeploy)

---

## Part 3: Post-Deployment Configuration

### Update GitHub Repository

Update your local `.env.production` files and push to GitHub:

```bash
git add .
git commit -m "Update production URLs for Render deployment"
git push origin main
```

### Enable Auto-Deploy

Both services should auto-deploy when you push to GitHub:
- Go to each service → Settings → "Auto-Deploy" should be enabled

---

## 🔧 Troubleshooting

### Backend Issues

**Issue: Database connection failed**
- Solution: Check PlanetScale connection details
- Verify DB_HOST, DB_USER, DB_PASSWORD, DB_NAME are correct
- Check if PlanetScale database is active

**Issue: Email not sending**
- Solution: Use Gmail App Password (not regular password)
- Enable 2-factor authentication in Gmail
- Generate App Password: https://myaccount.google.com/apppasswords

**Issue: CORS errors**
- Solution: Ensure FRONTEND_URL in backend matches your actual frontend URL
- Redeploy backend after changing environment variables

### Frontend Issues

**Issue: API calls failing**
- Solution: Check VITE_API_URL is correct
- Ensure backend is running
- Check browser console for exact error

**Issue: Build fails**
- Solution: Check if all dependencies are in package.json
- Clear Render build cache and redeploy

### Free Tier Limitations

Render free tier has these limitations:
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds (cold start)
- 750 hours/month of usage

To minimize cold starts:
- Keep the app active during demos
- Use a uptime monitor like UptimeRobot (free) to ping your backend every 5-10 minutes

---

## 📱 Testing Your Deployment

### Test Backend
```bash
curl https://dayflow-hrms-backend.onrender.com
```

### Test Frontend
1. Visit https://dayflow-hrms.onrender.com
2. Register a new account
3. Check email for verification link
4. Login and test features

### Admin Access
To create admin user, use the backend test script:
```bash
# Connect to Render backend via SSH or run locally with production DB
node backend/fixUserNames.js
```

Or manually update database to set user role to 'admin'.

---

## 🌟 Production Checklist

- [ ] Backend deployed and running
- [ ] Database connected successfully
- [ ] Frontend deployed and accessible
- [ ] CORS configured correctly
- [ ] Email notifications working
- [ ] Environment variables secured
- [ ] Admin user created
- [ ] Test all features (auth, leave management, admin panel)
- [ ] Mobile responsiveness verified
- [ ] Performance optimized

---

## 📊 Monitoring

### Render Dashboard
- Monitor logs in Render dashboard for each service
- Check metrics (CPU, Memory, Bandwidth)
- Set up alerts for service failures

### Recommended Tools
- **Uptime Monitoring**: UptimeRobot (https://uptimerobot.com)
- **Error Tracking**: Sentry (https://sentry.io)
- **Analytics**: Google Analytics or Vercel Analytics

---

## 🔐 Security Notes

1. **Never commit `.env` files** to GitHub
2. **Use strong JWT_SECRET** in production
3. **Enable HTTPS** (automatic with Render)
4. **Use Gmail App Passwords** (not regular passwords)
5. **Regularly update dependencies**: `npm audit fix`

---

## 🆘 Support

If you encounter issues:
1. Check Render logs: Service → Logs
2. Review environment variables
3. Test backend endpoints individually
4. Check browser console for frontend errors

---

## 🎉 Success!

Once deployed, your HRMS application will be live at:
- **Frontend**: https://dayflow-hrms.onrender.com
- **Backend API**: https://dayflow-hrms-backend.onrender.com

Share your live demo link with stakeholders and enjoy! 🚀
