# Render Backend Deployment Guide

This backend is a Node/Express API that uses Sequelize with MySQL. Render can run the web service directly, but this repo is not configured for Render Postgres. Use an external MySQL database, or deploy MySQL separately as a private Render service with a persistent disk.

## 1. Prepare MySQL

Create a MySQL database with any provider you prefer, then keep these values ready:

```env
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=dayflow_hrms
```

For hosted MySQL providers, make sure SSL is enabled or required. The backend already enables MySQL SSL when `NODE_ENV=production`.

## 2. Deploy the Backend on Render

1. Push this repository to GitHub.
2. In Render, create a new **Blueprint** from the repo if you want to use `render.yaml`, or create a **Web Service** manually.
3. If creating manually, use these settings:

```text
Name: dayflow-hrms-backend
Root Directory: backend
Runtime: Node
Build Command: npm ci
Start Command: npm start
Health Check Path: /
```

4. Add these environment variables in Render:

```env
NODE_ENV=production
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=dayflow_hrms
DB_DIALECT=mysql
JWT_SECRET=generate-a-long-random-secret
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=https://your-frontend-url.onrender.com
```

Do not set `PORT` manually. Render provides it at runtime, and `server.js` already reads `process.env.PORT`.

## 3. Verify the Deploy

Open the backend URL Render gives you:

```text
https://dayflow-hrms-backend.onrender.com/
```

You should see a JSON response:

```json
{
  "success": true,
  "message": "Dayflow HRMS API is running",
  "version": "1.0.0",
  "database": "MySQL"
}
```

Then check Render logs for:

```text
MySQL Database Connected Successfully
Database Synced
```

## 4. Common Fixes

- **Database connection failed**: confirm `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`; also confirm your MySQL provider allows Render to connect.
- **SSL error**: production uses SSL automatically. If your provider does not support SSL, update `backend/config/db.js` for that provider.
- **CORS error**: set `FRONTEND_URL` to the exact deployed frontend origin, such as `https://dayflow-hrms.onrender.com`, then redeploy the backend.
- **Email not sending**: Gmail needs an app password, not your regular Google password.

## 5. Important Security Note

If real secrets were ever committed to this repo, rotate them before deploying. That includes Gmail app passwords, database passwords, and JWT secrets.
