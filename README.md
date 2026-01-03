# 🏢 Dayflow HRMS - Human Resource Management System

![HRMS Banner](https://img.shields.io/badge/HRMS-Dayflow-blue)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange)
![License](https://img.shields.io/badge/License-ISC-yellow)

A modern, full-stack Human Resource Management System built with React, Node.js, Express, and MySQL.

## 🌟 Features

### For Employees
- ✅ User Registration & Email Verification
- 🔐 Secure Authentication (JWT)
- 📋 Personal Dashboard
- 📅 Leave Request Management
- 👤 Profile Management
- 📊 Attendance Tracking
- 📧 Email Notifications

### For Administrators
- 👥 Employee Management
- 📊 Leave Approval System
- 📈 Attendance Overview
- 👁️ Employee Details & History
- ⚙️ System Configuration
- 📧 Bulk Email Notifications

## 🚀 Live Demo

- **Frontend**: [https://dayflow-hrms.onrender.com](https://dayflow-hrms.onrender.com)
- **Backend API**: [https://dayflow-hrms-backend.onrender.com](https://dayflow-hrms-backend.onrender.com)

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.0 - UI Framework
- **Vite** - Build Tool
- **React Router** - Navigation
- **Axios** - HTTP Client
- **Bootstrap** - CSS Framework
- **React Toastify** - Notifications
- **React Icons** - Icon Library

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **Sequelize** - ORM
- **MySQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **Nodemailer** - Email Service

## 📁 Project Structure

```
human-resource/
├── backend/                 # Backend API
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Authentication middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── server.js           # Entry point
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── assets/             # Static assets
│   └── main.jsx            # Entry point
├── docs/                   # Documentation
└── public/                 # Public assets
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- Git

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/purveshpatil41/dayflow-hrms.git
cd dayflow-hrms
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Configure your .env file with:
# - Database credentials
# - JWT secret
# - Email credentials
```

3. **Frontend Setup**
```bash
# From root directory
npm install
```

4. **Database Setup**
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE dayflow_hrms;
exit;

# Backend will auto-sync tables on first run
```

5. **Run the Application**

Terminal 1 (Backend):
```bash
cd backend
npm start
# Runs on http://localhost:5000
```

Terminal 2 (Frontend):
```bash
npm run dev
# Runs on http://localhost:5173
```

## 🌐 Deployment

### Deploy to Render

We provide complete Render deployment support. See our detailed guide:

📖 **[Render Deployment Guide](RENDER_DEPLOYMENT_GUIDE.md)**

Quick deployment:
```bash
# Windows
deploy-to-render.bat

# Linux/Mac
bash deploy-to-render.sh
```

### Environment Variables

#### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=dayflow_hrms
JWT_SECRET=your_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify/:token` - Verify email
- `POST /api/auth/resend-verification` - Resend verification email

### Leaves
- `GET /api/leaves/my-leaves` - Get user's leaves
- `POST /api/leaves/apply` - Apply for leave
- `GET /api/leaves/all` - Get all leaves (Admin)
- `PUT /api/leaves/:id/status` - Update leave status (Admin)

### Admin
- `GET /api/admin/employees` - Get all employees
- `GET /api/admin/employees/:id` - Get employee details
- `PUT /api/admin/employees/:id` - Update employee
- `DELETE /api/admin/employees/:id` - Delete employee

## 👥 User Roles

### Employee
- Can view own dashboard
- Can apply for leaves
- Can update profile
- Can view attendance

### Admin
- All employee permissions
- Can manage all employees
- Can approve/reject leaves
- Can view all attendance
- Can access admin dashboard

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Email verification
- Protected API routes
- CORS configuration
- Input validation
- SQL injection prevention (via Sequelize ORM)

## 📧 Email Configuration

The system uses Gmail SMTP for sending emails. To set up:

1. Enable 2-factor authentication in Gmail
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the App Password in EMAIL_PASS environment variable

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
npm test
```

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Authors

- **Ashok Shah** - Initial Development
- **Purvesh Patil** - Project Maintainer

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email ashokkrsah19@gmail.com or create an issue in the repository.

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community
- MySQL documentation
- Bootstrap for UI components
- All contributors and users

---

**Made with ❤️ for efficient HR management**
