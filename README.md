# House of Hilsha - MERN Authentication System

A production-ready authentication system built with MongoDB, Express, React, Node.js, TypeScript, and Better Auth.

## 🏗️ Architecture

```
├── src/                          # Backend source code
│   ├── config/
│   │   ├── betterAuth.ts         # Better Auth configuration
│   │   ├── database.ts           # MongoDB/Mongoose connection
│   │   └── env.ts                # Environment validation
│   ├── controllers/
│   │   └── auth.controller.ts    # Auth request handlers
│   ├── services/
│   │   └── auth.service.ts       # Auth business logic
│   ├── models/
│   │   └── user.model.ts         # User profile schema
│   ├── routes/
│   │   └── auth.routes.ts        # Auth API routes
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # Auth protection middleware
│   │   ├── error.middleware.ts   # Global error handler
│   │   └── rateLimiter.middleware.ts
│   ├── utils/
│   │   ├── email.ts              # Email sending utility
│   │   └── validation.ts         # Zod validation schemas
│   ├── app.ts                    # Express app setup
│   └── server.ts                 # Server entry point
├── frontend/                     # React frontend
│   └── src/
│       ├── components/           # Reusable components
│       ├── pages/                # Auth pages
│       ├── store/                # Zustand auth store
│       └── lib/                  # API client
```

## 🔐 Authentication Flow

### 1. Signup Flow
```
User submits signup form
        ↓
Backend validates input (Zod)
        ↓
Better Auth creates user (password auto-hashed)
        ↓
User profile created in MongoDB
        ↓
Verification email sent (async)
        ↓
User redirected to "check email" page
```

### 2. Email Verification Flow
```
User clicks verification link in email
        ↓
Better Auth validates token
        ↓
User.emailVerified set to true
        ↓
User redirected to login (or auto-signed in)
```

### 3. Login Flow
```
User submits login form
        ↓
Backend validates input
        ↓
Better Auth verifies credentials
        ↓
Check if email is verified (403 if not)
        ↓
Session created (httpOnly cookie)
        ↓
User redirected to dashboard
```

### 4. Password Reset Flow
```
User requests password reset
        ↓
Better Auth generates reset token
        ↓
Reset email sent (async)
        ↓
User clicks link in email
        ↓
User enters new password
        ↓
Better Auth validates token & updates password
        ↓
Old sessions invalidated
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- SMTP server (Gmail, SendGrid, etc.)

### Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables (see below)

4. Start development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

## 🔧 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/house-of-hilsha` |
| `BETTER_AUTH_SECRET` | Secret key (32+ chars) | `your-super-secret-key-at-least-32-characters` |
| `BETTER_AUTH_URL` | Backend URL | `http://localhost:5000` |
| `FRONTEND_URL` | Frontend URL (CORS) | `http://localhost:3000` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_SECURE` | Use TLS | `false` |
| `SMTP_USER` | SMTP username | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP password/app key | `your-app-specific-password` |
| `EMAIL_FROM` | From email address | `noreply@houseofhilsha.com` |
| `EMAIL_VERIFICATION_EXPIRY` | Verification token TTL (seconds) | `86400` (24h) |
| `PASSWORD_RESET_EXPIRY` | Reset token TTL (seconds) | `3600` (1h) |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `AUTH_RATE_LIMIT_MAX` | Max auth attempts per window | `10` |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |

## 📡 API Endpoints

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/signup` | Register new user |
| `POST` | `/auth/login` | Authenticate user |
| `POST` | `/auth/logout` | Sign out user |
| `POST` | `/auth/forgot-password` | Request password reset |
| `POST` | `/auth/reset-password` | Reset password with token |
| `POST` | `/auth/change-password` | Change password (authenticated) |
| `POST` | `/auth/send-verification-email` | Resend verification email |
| `GET` | `/auth/session` | Get current session |
| `GET` | `/auth/profile` | Get user profile (authenticated) |

### Better Auth Internal Routes

| Endpoint | Description |
|----------|-------------|
| `/api/auth/*` | Better Auth internal handlers (verification callbacks, etc.) |

## 🔒 Security Features

- **Password Hashing**: Scrypt (via Better Auth)
- **Password Requirements**: 8+ chars, uppercase, lowercase, number, special char
- **Input Validation**: Zod schemas
- **Rate Limiting**: Per-IP limits on auth endpoints
- **CORS**: Configured for frontend origin only
- **Helmet**: Security headers
- **httpOnly Cookies**: Session tokens not accessible via JS
- **Token Expiration**: Email verification (24h), Password reset (1h)
- **Session Management**: 7-day sessions with auto-refresh

## 📝 Request/Response Examples

### Signup
```typescript
// Request
POST /auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

// Response (201)
{
  "success": true,
  "message": "Account created successfully. Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "...",
      "email": "john@example.com",
      "name": "John Doe",
      "emailVerified": false
    }
  }
}
```

### Login
```typescript
// Request
POST /auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "rememberMe": true
}

// Response (200)
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "john@example.com",
      "name": "John Doe",
      "emailVerified": true
    },
    "session": {
      "id": "...",
      "expiresAt": "2026-01-16T..."
    }
  }
}

// Error Response (403 - Unverified)
{
  "success": false,
  "status": "fail",
  "message": "Please verify your email address before signing in"
}
```

## 🧪 Testing the Flow

1. **Sign Up**: Create account at `/signup`
2. **Check Email**: Verification email sent automatically
3. **Verify Email**: Click link in email (redirects to `/verify-email?verified=true`)
4. **Sign In**: Login at `/login`
5. **Dashboard**: Access protected `/dashboard`
6. **Password Reset**: Test via `/forgot-password`

## 📦 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use production MongoDB (Atlas recommended)
3. Configure production SMTP service
4. Generate strong `BETTER_AUTH_SECRET` (32+ random chars)
5. Enable HTTPS (reverse proxy or cloud provider)

### Frontend
1. Build: `npm run build`
2. Deploy `dist/` to CDN/static hosting
3. Configure `VITE_API_URL` for production API

## 🛠️ Tech Stack

**Backend**
- Node.js + Express
- TypeScript
- Better Auth (authentication)
- MongoDB + Mongoose
- Zod (validation)
- Nodemailer (emails)

**Frontend**
- React 18
- TypeScript
- React Router v7
- Zustand (state)
- Tailwind CSS

## 📄 License

MIT
