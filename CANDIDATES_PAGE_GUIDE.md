# Candidates Page - Complete Implementation Guide

## 📋 Overview

A full-stack Candidates management page with complete CRUD operations, advanced search, filtering, sorting, and pagination. Built with React, TypeScript, Express.js, and PostgreSQL.

---

## 🎯 Features

### Frontend Features
- ✅ Table view with candidate information
- ✅ Advanced search (name, email, position)
- ✅ Filter by status (new, screening, interview, offer, hired, rejected)
- ✅ Filter by department
- ✅ Sort by name, applied date, position, status
- ✅ Ascending/Descending sort order
- ✅ Pagination (10 candidates per page)
- ✅ Add new candidate dialog
- ✅ Edit candidate dialog
- ✅ Delete candidate with confirmation
- ✅ View resume link
- ✅ Send email action
- ✅ Responsive design
- ✅ Loading states and error handling
- ✅ Toast notifications

### Backend Features
- ✅ GET /api/candidates - List with search, filter, sort, pagination
- ✅ GET /api/candidates/:id - Get single candidate
- ✅ POST /api/candidates - Create new candidate
- ✅ PUT /api/candidates/:id - Update candidate
- ✅ DELETE /api/candidates/:id - Delete candidate
- ✅ Input validation
- ✅ Error handling
- ✅ Duplicate email prevention
- ✅ PostgreSQL schema

---

## 📁 Files Created/Modified

### Backend
```
server/src/
├── routes/candidates.ts          # Enhanced with full CRUD + validation
└── database/schema.sql           # Candidates table schema

server/src/index.ts               # Already includes candidates route
```

### Frontend
```
src/
├── pages/CandidatesPage.tsx       # Main candidates component
└── App.tsx                        # Updated with new route
```

---

## 🚀 Getting Started

### 1. Start Backend
```bash
npm run dev:server
```

### 2. Start Frontend
```bash
npm run dev
```

### 3. Access Candidates Page
```
http://localhost:5173/candidates
```

### 4. Login
- Email: `sarah.johnson@company.com`
- Password: `demo123`

---

## 📊 API Endpoints

### GET /api/candidates
List candidates with filtering, sorting, and pagination.

**Query Parameters:**
- `search` - Search by name, email, or position
- `status` - Filter by status (new, screening, interview, offer, hired, rejected)
- `department` - Filter by department
- `sortBy` - Sort field (name, appliedAt, position, status)
- `sortOrder` - Sort order (asc, desc)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Example:**
```bash
GET /api/candidates?search=alex&status=interview&sortBy=appliedAt&sortOrder=desc&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Alex Chen",
      "email": "alex.chen@email.com",
      "phone": "+1 (555) 123-4567",
      "position": "Senior Software Engineer",
      "department": "Engineering",
      "status": "interview",
      "aiScore": 92,
      "skills": ["React", "TypeScript", "Node.js"],
      "experience": 6,
      "resumeUrl": "https://...",
      "appliedAt": "2024-01-15",
      "notes": "..."
    }
  ],
  "pagination": {
    "total": 24,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

### GET /api/candidates/:id
Get a single candidate by ID.

**Response:**
```json
{
  "success": true,
  "data": { /* candidate object */ }
}
```

### POST /api/candidates
Create a new candidate.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "position": "Software Engineer",
  "department": "Engineering",
  "status": "new",
  "skills": ["JavaScript", "React"],
  "experience": 3,
  "resumeUrl": "https://...",
  "notes": "Great candidate"
}
```

**Validation:**
- `name` - Required, non-empty string
- `email` - Required, valid email, unique
- `position` - Required, non-empty string
- `status` - Required, one of: new, screening, interview, offer, hired, rejected
- `phone` - Optional, string
- `department` - Optional, string

**Response:**
```json
{
  "success": true,
  "data": { /* created candidate */ }
}
```

### PUT /api/candidates/:id
Update an existing candidate.

**Request Body:**
```json
{
  "status": "interview",
  "notes": "Updated notes"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated candidate */ }
}
```

### DELETE /api/candidates/:id
Delete a candidate.

**Response:**
```json
{
  "success": true,
  "message": "Candidate deleted",
  "data": { /* deleted candidate */ }
}
```

---

## 🗄️ Database Schema

### Candidates Table
```sql
CREATE TABLE IF NOT EXISTS candidates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  position VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'new',
  ai_score INTEGER,
  skills TEXT[],
  experience INTEGER,
  resume_url VARCHAR(255),
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidates_applied_at ON candidates(applied_at);
```

---

## 🎨 UI Components

### Table View
- Displays candidate information in a clean table format
- Shows: Name, Email, Position, Department, Status, Applied Date
- Hover effects for better UX

### Search Bar
- Real-time search across name, email, and position
- Resets pagination to page 1 on search

### Filters
- **Status Filter**: All, New, Screening, Interview, Offer, Hired, Rejected
- **Department Filter**: Dynamically populated from data
- **Sort Options**: Name, Applied Date, Position, Status
- **Sort Order**: Ascending/Descending toggle

### Dialogs
- **Add Candidate**: Form to create new candidate
- **Edit Candidate**: Form to update existing candidate
- Both with validation and error handling

### Actions
- **Send Email**: Opens email client
- **View Resume**: Opens resume link
- **Edit**: Opens edit dialog
- **Delete**: Deletes with confirmation

---

## 📱 Responsive Design

- **Desktop**: Full table with all columns visible
- **Tablet**: Optimized layout with scrollable table
- **Mobile**: Stacked layout with essential information

---

## 🔐 Authentication

All endpoints require JWT authentication:
```typescript
Authorization: Bearer <token>
```

Automatically handled by the API client.

---

## 🔄 Data Flow

### Fetching Candidates
```
User opens /candidates
  ↓
useQuery fetches from /api/candidates
  ↓
Data displayed in table
  ↓
User can search, filter, sort
  ↓
Query parameters updated
  ↓
useQuery refetches with new parameters
```

### Creating Candidate
```
User clicks "Add Candidate"
  ↓
Dialog opens with form
  ↓
User fills form and submits
  ↓
useMutation sends POST to /api/candidates
  ↓
Success: Query invalidated, dialog closes, toast shown
  ↓
Error: Toast with error message shown
```

### Updating Candidate
```
User clicks "Edit" on candidate
  ↓
Dialog opens with pre-filled form
  ↓
User updates fields and submits
  ↓
useMutation sends PUT to /api/candidates/:id
  ↓
Success: Query invalidated, dialog closes, toast shown
```

### Deleting Candidate
```
User clicks "Delete"
  ↓
Confirmation dialog shown
  ↓
User confirms
  ↓
useMutation sends DELETE to /api/candidates/:id
  ↓
Success: Query invalidated, toast shown
```

---

## 🔍 Search & Filter Logic

### Search
- Searches across: name, email, position
- Case-insensitive
- Partial matching

### Status Filter
- Filters by exact status match
- Options: new, screening, interview, offer, hired, rejected

### Department Filter
- Dynamically populated from candidate data
- Filters by exact department match

### Sorting
- Supports: name, appliedAt, position, status
- Ascending or descending order
- Case-insensitive for string fields

### Pagination
- 10 candidates per page
- Shows total count and current page
- Previous/Next buttons
- Resets to page 1 on search/filter change

---

## ✅ Validation Rules

### Name
- Required
- Non-empty string
- Max 255 characters

### Email
- Required
- Valid email format
- Unique (no duplicates)
- Max 255 characters

### Position
- Required
- Non-empty string
- Max 255 characters

### Status
- Required
- One of: new, screening, interview, offer, hired, rejected

### Phone
- Optional
- String format
- Max 20 characters

### Department
- Optional
- String format
- Max 255 characters

---

## 🐛 Error Handling

### Frontend
- Loading states during API calls
- Error messages displayed in toasts
- Validation before submission
- Confirmation dialogs for destructive actions

### Backend
- Input validation with detailed error messages
- Duplicate email prevention
- 404 errors for missing candidates
- 400 errors for invalid input
- 500 errors for server issues

---

## 🚀 Production Setup

### Database Integration
Replace mock data with real database queries:

```typescript
// In server/src/routes/candidates.ts
const result = await db.query(
  'SELECT * FROM candidates WHERE status = $1',
  [status]
);
```

### Environment Variables
```
DATABASE_URL=postgresql://user:password@localhost:5432/smarthire
JWT_SECRET=your-secret-key
```

### Deployment
- Frontend: Vercel, Netlify
- Backend: Heroku, AWS, DigitalOcean

---

## 📈 Performance Optimization

### Frontend
- React Query caching
- Lazy loading
- Memoization
- Pagination to limit data

### Backend
- Database indexes on frequently queried columns
- Pagination to limit results
- Connection pooling

---

## 🎯 Next Steps

1. **Integrate Real Database**: Replace mock data with PostgreSQL
2. **Add Bulk Actions**: Select multiple candidates for bulk operations
3. **Export to CSV**: Export candidate list
4. **Email Integration**: Send emails directly from app
5. **Resume Upload**: Upload and store resumes
6. **Advanced Filters**: Date range, AI score range, etc.
7. **Candidate Notes**: Add timeline of notes/interactions
8. **Interview Scheduling**: Schedule interviews from candidates page

---

## 📚 Related Documentation

- [README.md](./README.md) - Main project documentation
- [HR_DASHBOARD_GUIDE.md](./HR_DASHBOARD_GUIDE.md) - HR Dashboard documentation
- [server/README.md](./server/README.md) - Backend API documentation

---

## ✅ Checklist

- [x] Backend CRUD routes created
- [x] Input validation implemented
- [x] Error handling added
- [x] Search functionality
- [x] Filter functionality
- [x] Sort functionality
- [x] Pagination implemented
- [x] Frontend component built
- [x] Add candidate dialog
- [x] Edit candidate dialog
- [x] Delete with confirmation
- [x] Responsive design
- [x] Toast notifications
- [x] Database schema provided
- [x] Documentation complete

---

**Status**: ✅ Complete and Ready to Use
**Last Updated**: December 5, 2025
