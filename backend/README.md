# Dayflow HRMS Backend

## Setup Instructions

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure `.env` with your credentials:
- MongoDB URI
- JWT Secret
- Gmail SMTP credentials (use App Password)
- Frontend URL

4. Start server:
```bash
npm run dev
```

## API Endpoints

### Authentication

**POST** `/api/auth/register`
- Register new user
- Body: `{ employeeId, email, password, role }`

**GET** `/api/auth/verify-email/:token`
- Verify email via token

**POST** `/api/auth/verify-otp`
- Verify OTP
- Body: `{ email, otp }`

**POST** `/api/auth/login`
- User login
- Body: `{ email, password }`

**GET** `/api/auth/me`
- Get current user (Protected)
- Header: `Authorization: Bearer <token>`

## Gmail Setup

1. Enable 2-Factor Authentication in Gmail
2. Generate App Password: Google Account → Security → App Passwords
3. Use App Password in `.env` as `EMAIL_PASS`
