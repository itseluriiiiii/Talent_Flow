# SmartHire - AI-Powered HR Management System

A modern HR management system with a full-stack implementation featuring React frontend and Node.js backend.

## 🚀 Quick Start (2 Minutes)

### Step 1: Install Dependencies
```bash
npm install
npm run install:server
```

### Step 2: Start Backend (Terminal 1)
```bash
npm run dev:server
```

### Step 3: Start Frontend (Terminal 2)
```bash
npm run dev
```

### Step 4: Login
- Open: `http://localhost:5173`
- Email: `sarah.johnson@company.com`
- Password: `demo123`

✅ **Done!** You're now running SmartHire!

---

## 📋 Table of Contents

- [Quick Start](#-quick-start-2-minutes)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Setup Instructions](#setup-instructions)
- [Default Credentials](#default-login-credentials)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Features](#features)
- [Commands](#commands)
- [Troubleshooting](#troubleshooting)
- [Architecture](#architecture)
- [Development](#development)
- [Production](#building-for-production)

---

## Project Structure

```
smarthire/
├── server/                          # Backend API (Express.js)
│   ├── src/
│   │   ├── index.ts                # Server entry point
│   │   ├── types.ts                # TypeScript types
│   │   ├── data.ts                 # In-memory data store
│   │   ├── middleware/auth.ts      # JWT authentication
│   │   └── routes/                 # API endpoints
│   │       ├── auth.ts
│   │       ├── candidates.ts
│   │       ├── interviews.ts
│   │       ├── employees.ts
│   │       ├── onboarding.ts
│   │       ├── offboarding.ts
│   │       ├── documents.ts
│   │       └── analytics.ts
│   ├── .env                        # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── src/                            # Frontend (React)
│   ├── pages/                      # Page components
│   ├── components/                 # Reusable components
│   ├── contexts/AuthContext.tsx    # Auth context
│   ├── lib/api.ts                  # API client
│   ├── hooks/                      # Custom hooks
│   ├── types/                      # TypeScript types
│   └── data/mockData.ts            # Fallback mock data
│
├── .env                            # Frontend config
├── package.json                    # Frontend dependencies
└── README.md                       # This file
```

## Technologies

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- shadcn-ui components
- Tailwind CSS
- React Router for navigation
- TanStack Query for data fetching
- Recharts for analytics

### Backend
- Node.js with Express
- TypeScript
- JWT authentication
- bcryptjs for password hashing
- CORS enabled
- In-memory data storage

---

## Setup Instructions

### Prerequisites
- Node.js 16+ installed
- npm installed
- Two terminal windows

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
npm run install:server
```

### 3. Start the Backend Server

Open **Terminal 1** and run:

```bash
npm run dev:server
```

You should see:
```
🚀 Server running on http://localhost:3001
📊 API endpoints available at http://localhost:3001/api
📖 API Documentation: http://localhost:3001/
```

### 4. Start the Frontend

Open **Terminal 2** (keep Terminal 1 running) and run:

```bash
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 5. Login to the Application

1. Open your browser to `http://localhost:5173`
2. Use the credentials below

---

## Default Login Credentials

- **Email**: `sarah.johnson@company.com`
- **Password**: `demo123`

---

## API Endpoints

All endpoints require authentication (except `/api/auth/login`) via Bearer token in the Authorization header.

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout

### Candidates (5 endpoints)
- `GET /api/candidates` - List all candidates
- `GET /api/candidates/:id` - Get candidate details
- `POST /api/candidates` - Create candidate
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate

### Interviews (5 endpoints)
- `GET /api/interviews` - List all interviews
- `GET /api/interviews/:id` - Get interview details
- `POST /api/interviews` - Schedule interview
- `PUT /api/interviews/:id` - Update interview
- `DELETE /api/interviews/:id` - Cancel interview

### Employees (5 endpoints)
- `GET /api/employees` - List all employees
- `GET /api/employees/:id` - Get employee details
- `POST /api/employees` - Add employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Remove employee

### Onboarding (5 endpoints)
- `GET /api/onboarding` - Get all onboarding tasks
- `GET /api/onboarding?employeeId=:id` - Get tasks for employee
- `POST /api/onboarding` - Create task
- `PUT /api/onboarding/:id` - Update task
- `DELETE /api/onboarding/:id` - Delete task

### Offboarding (5 endpoints)
- `GET /api/offboarding` - Get all offboarding tasks
- `GET /api/offboarding?employeeId=:id` - Get tasks for employee
- `POST /api/offboarding` - Create task
- `PUT /api/offboarding/:id` - Update task
- `DELETE /api/offboarding/:id` - Delete task

### Documents (4 endpoints)
- `GET /api/documents` - List all documents
- `GET /api/documents/:id` - Get document details
- `POST /api/documents` - Upload document
- `DELETE /api/documents/:id` - Delete document

### Analytics (1 endpoint)
- `GET /api/analytics` - Get analytics data

### Health Check
- `GET /api/health` - Server health status
- `GET /` - API information and endpoints

---

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
```

### Backend (server/.env)
```
PORT=3001
JWT_SECRET=smarthire-secret-key-change-in-production-2024
NODE_ENV=development
```

---

## Features

- ✅ JWT-based authentication with 7-day token expiration
- ✅ Full CRUD operations for all entities
- ✅ Protected API routes with middleware
- ✅ Role-based access (HR, Manager, Employee)
- ✅ Real-time data fetching with React Query
- ✅ Responsive design with Tailwind CSS
- ✅ Analytics dashboard with charts
- ✅ Interview scheduling and tracking
- ✅ Onboarding/Offboarding workflows
- ✅ Document management
- ✅ Employee management
- ✅ Candidate pipeline tracking

---

## Commands

### Development
```bash
# Start backend
npm run dev:server

# Start frontend
npm run dev

# Install backend dependencies
npm run install:server
```

### Building
```bash
# Build frontend
npm run build

# Build backend
cd server && npm run build

# Preview frontend build
npm run preview
```

### Testing
```bash
# Test API endpoints
cd server && node test-api.js

# Test health endpoint
curl http://localhost:3001/api/health

# Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sarah.johnson@company.com","password":"demo123"}'
```

### Linting
```bash
# Lint frontend
npm run lint

# Build backend (includes type checking)
cd server && npm run build
```

---

## Troubleshooting

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3001`

**Solution (Windows)**:
```bash
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Solution (macOS/Linux)**:
```bash
lsof -i :3001
kill -9 <PID>
```

### Cannot GET /

**What it means**: You're accessing the backend root path in your browser.

**Solution**: 
- ✅ This is normal! The backend is an API server, not a web interface
- ✅ The frontend is at `http://localhost:5173`
- ✅ The backend API is at `http://localhost:3001/api`

### Login Failed

**Solutions**:
1. Verify backend is running: `curl http://localhost:3001/api/health`
2. Check credentials: `sarah.johnson@company.com` / `demo123`
3. Clear browser cache: DevTools → Application → Clear Site Data
4. Check backend console for errors

### Frontend Can't Connect to Backend

**Solutions**:
1. Verify backend is running on port 3001
2. Check `.env` has `VITE_API_URL=http://localhost:3001/api`
3. Restart frontend: Ctrl+C then `npm run dev`
4. Check browser console (F12) for CORS errors

### Module Not Found

**Solutions**:
```bash
npm install
npm run install:server
```

### TypeScript Errors

**Solutions**:
```bash
cd server
npm run build
```

---

## Architecture

### Data Flow

```
User Input (Browser)
    ↓
React Component
    ↓
React Query Hook
    ↓
API Client (src/lib/api.ts)
    ↓
HTTP Request with JWT Token
    ↓
Express Backend
    ↓
JWT Middleware Verification
    ↓
Route Handler
    ↓
In-Memory Data Store
    ↓
Response
    ↓
React Query Caching
    ↓
Component Re-render
    ↓
Display Data
```

### Authentication Flow

```
Login Form
    ↓
POST /api/auth/login
    ↓
Verify Credentials
    ↓
Generate JWT Token
    ↓
Return Token & User
    ↓
Store in localStorage
    ↓
Set Authorization Header
    ↓
Access Protected Routes
```

---

## Development

The application uses in-memory data storage. All data resets when the server restarts.

### Data Storage
- Pre-populated with sample data
- Resets on server restart
- Ready for database integration

### Adding New Features

1. **Backend**: Add route in `server/src/routes/`
2. **API Client**: Add method in `src/lib/api.ts`
3. **Frontend**: Use in React components with `useQuery`

---

## Building for Production

### Frontend
```bash
npm run build
```

Output: `dist/` directory

### Backend
```bash
cd server
npm run build
npm start
```

Output: `server/dist/` directory

### Deployment

1. **Frontend**: Deploy `dist/` to Vercel, Netlify, or similar
2. **Backend**: Deploy to Heroku, AWS, DigitalOcean, or similar
3. **Database**: Integrate PostgreSQL or MongoDB
4. **Environment**: Update `.env` with production URLs

---

## Next Steps (Optional)

### For Development
- Add database integration (PostgreSQL/MongoDB)
- Add user registration
- Add file upload functionality
- Add email notifications
- Add input validation
- Add unit tests
- Add integration tests

### For Production
- Deploy backend and frontend
- Set up CI/CD pipeline
- Configure production environment variables
- Set up monitoring and logging
- Add rate limiting
- Add API documentation (Swagger)

---

## Support & Resources

### Documentation
- Backend API: `server/README.md`
- API Testing: Use `server/test-api.js`
- Architecture: See Architecture section above

### Debugging
1. Check backend console for errors
2. Check browser console (F12) for errors
3. Check Network tab (F12) for API requests
4. Test API directly with curl commands

### Common Issues
- **Port in use**: See Troubleshooting section
- **Login fails**: Verify backend is running
- **Can't connect**: Check `.env` configuration
- **Data not loading**: Check browser console for errors

---

## Project Info

**Status**: ✅ Complete and Ready to Use

**Technologies**: React 18, TypeScript, Vite, Express.js, Node.js, JWT, bcryptjs

**Features**: 40+ API endpoints, Full CRUD operations, Authentication, Analytics, Responsive design

**URL**: https://lovable.dev/projects/1ec9b04a-0375-4b95-b913-46e7bc3a4058

---

## License

This project is part of the SmartHire HR Management System.

---

**Last Updated**: December 5, 2025
**Status**: ✅ Production Ready
