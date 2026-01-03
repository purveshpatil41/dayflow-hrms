# 📋 Render Deployment Checklist

Use this checklist to ensure smooth deployment of your Dayflow HRMS application on Render.

## ✅ Pre-Deployment

- [ ] Code committed to GitHub
- [ ] `.env` files are in `.gitignore` (not committed)
- [ ] All dependencies listed in `package.json`
- [ ] Test application locally (frontend + backend)
- [ ] Database schema is finalized
- [ ] Email configuration tested

## ✅ Database Setup (PlanetScale)

- [ ] Created PlanetScale account
- [ ] Created new database: `dayflow_hrms`
- [ ] Generated database password
- [ ] Noted down connection details:
  - [ ] Host
  - [ ] Username
  - [ ] Password
  - [ ] Database name
  - [ ] Port

## ✅ Backend Deployment

- [ ] Created Render account
- [ ] Connected GitHub repository to Render
- [ ] Created new Web Service
- [ ] Configured build settings:
  - [ ] Root Directory: `backend`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
  - [ ] Runtime: Node
- [ ] Added environment variables:
  - [ ] NODE_ENV=production
  - [ ] PORT=10000
  - [ ] DB_HOST
  - [ ] DB_USER
  - [ ] DB_PASSWORD
  - [ ] DB_NAME
  - [ ] DB_DIALECT=mysql
  - [ ] JWT_SECRET
  - [ ] JWT_EXPIRE=7d
  - [ ] EMAIL_HOST
  - [ ] EMAIL_PORT
  - [ ] EMAIL_USER
  - [ ] EMAIL_PASS
  - [ ] FRONTEND_URL
- [ ] Backend deployed successfully
- [ ] Tested backend URL: `https://dayflow-hrms-backend.onrender.com`
- [ ] API returns success message

## ✅ Frontend Deployment

- [ ] Created Static Site on Render
- [ ] Configured build settings:
  - [ ] Build Command: `npm install && npm run build`
  - [ ] Publish Directory: `dist`
- [ ] Added environment variable:
  - [ ] VITE_API_URL=https://dayflow-hrms-backend.onrender.com
- [ ] Frontend deployed successfully
- [ ] Tested frontend URL: `https://dayflow-hrms.onrender.com`
- [ ] Frontend loads properly

## ✅ Post-Deployment Configuration

- [ ] Updated backend `FRONTEND_URL` with actual frontend URL
- [ ] Backend redeployed with new CORS settings
- [ ] Tested CORS (frontend can call backend)
- [ ] Email verification working
- [ ] User registration working
- [ ] User login working
- [ ] Leave management working
- [ ] Admin panel accessible

## ✅ Testing & Verification

- [ ] Register new test account
- [ ] Verify email received
- [ ] Login with verified account
- [ ] Submit leave request
- [ ] Create admin user (manual DB update or script)
- [ ] Login as admin
- [ ] Approve/reject leaves
- [ ] View all employees
- [ ] Test on mobile device
- [ ] Test all features end-to-end

## ✅ Performance & Monitoring

- [ ] Set up UptimeRobot to prevent cold starts
- [ ] Monitor Render logs for errors
- [ ] Check response times
- [ ] Verify database queries are optimized
- [ ] Test with multiple users

## ✅ Security

- [ ] JWT_SECRET is strong and unique
- [ ] Database credentials are secure
- [ ] No sensitive data in GitHub
- [ ] HTTPS enabled (automatic with Render)
- [ ] CORS configured correctly
- [ ] Email App Password used (not regular password)

## ✅ Documentation

- [ ] README.md updated with live demo links
- [ ] Deployment guide reviewed
- [ ] API documentation accessible
- [ ] User guide created (if needed)

## ✅ Final Steps

- [ ] Share live demo links with team/stakeholders
- [ ] Create demo accounts for testing
- [ ] Document any known issues
- [ ] Plan for future updates
- [ ] Enable auto-deploy from GitHub

---

## 🎉 Deployment Complete!

Your live URLs:
- Frontend: https://dayflow-hrms.onrender.com
- Backend: https://dayflow-hrms-backend.onrender.com

---

## 🚨 Troubleshooting

If any step fails, refer to:
1. [RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md) - Detailed deployment guide
2. Render service logs
3. Browser console errors
4. Backend API errors

---

## 📞 Need Help?

- Check Render documentation: https://render.com/docs
- Review PlanetScale docs: https://planetscale.com/docs
- Check project issues on GitHub
- Contact: ashokkrsah19@gmail.com
