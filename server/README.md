# TalentFlow Backend API

Backend server for the TalentFlow HR Management System.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/logout` - Logout

### Candidates
- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/:id` - Get candidate by ID
- `POST /api/candidates` - Create new candidate
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate

### Interviews
- `GET /api/interviews` - Get all interviews
- `GET /api/interviews/:id` - Get interview by ID
- `POST /api/interviews` - Schedule new interview
- `PUT /api/interviews/:id` - Update interview
- `DELETE /api/interviews/:id` - Cancel interview

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Add new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Remove employee

### Onboarding
- `GET /api/onboarding` - Get all onboarding tasks
- `GET /api/onboarding?employeeId=:id` - Get tasks for specific employee
- `POST /api/onboarding` - Create new task
- `PUT /api/onboarding/:id` - Update task
- `DELETE /api/onboarding/:id` - Delete task

### Offboarding
- `GET /api/offboarding` - Get all offboarding tasks
- `GET /api/offboarding?employeeId=:id` - Get tasks for specific employee
- `POST /api/offboarding` - Create new task
- `PUT /api/offboarding/:id` - Update task
- `DELETE /api/offboarding/:id` - Delete task

### Documents
- `GET /api/documents` - Get all documents
- `GET /api/documents/:id` - Get document by ID
- `POST /api/documents` - Upload new document
- `DELETE /api/documents/:id` - Delete document

### Analytics
- `GET /api/analytics` - Get analytics data

## Default Credentials

- Email: `sarah.johnson@company.com`
- Password: `demo123`

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
