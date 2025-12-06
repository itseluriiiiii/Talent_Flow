-- SmartHire Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'employee',
  avatar VARCHAR(255),
  department VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Candidates table
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

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  position VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  manager_id INTEGER REFERENCES employees(id),
  start_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  avatar VARCHAR(255),
  skills TEXT[],
  performance_score DECIMAL(3,1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id SERIAL PRIMARY KEY,
  candidate_id INTEGER NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  candidate_name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  scheduled_at TIMESTAMP NOT NULL,
  duration INTEGER,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
  interviewers TEXT[],
  feedback_rating INTEGER,
  feedback_strengths TEXT[],
  feedback_weaknesses TEXT[],
  feedback_recommendation VARCHAR(50),
  feedback_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Onboarding tasks table
CREATE TABLE IF NOT EXISTS onboarding_tasks (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  due_date DATE NOT NULL,
  assigned_to VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Offboarding tasks table
CREATE TABLE IF NOT EXISTS offboarding_tasks (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  due_date DATE NOT NULL,
  assigned_to VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  uploaded_by VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  size INTEGER,
  url VARCHAR(255),
  employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dashboard stats view (for quick access)
CREATE VIEW IF NOT EXISTS dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM employees WHERE status = 'active') as total_employees,
  (SELECT COUNT(*) FROM candidates WHERE applied_at >= CURRENT_DATE - INTERVAL '30 days') as new_candidates_month,
  (SELECT COUNT(*) FROM interviews WHERE status = 'completed' AND scheduled_at >= CURRENT_DATE - INTERVAL '30 days') as completed_interviews_month,
  (SELECT COUNT(*) FROM onboarding_tasks WHERE status IN ('pending', 'in_progress')) as active_onboarding_tasks,
  (SELECT COUNT(*) FROM employees WHERE status = 'onboarding') as employees_onboarding,
  (SELECT COUNT(*) FROM candidates WHERE status = 'interview') as candidates_in_interview,
  (SELECT AVG(performance_score) FROM employees WHERE performance_score IS NOT NULL) as avg_performance_score,
  (SELECT COUNT(*) FROM employees WHERE status = 'offboarding') as employees_offboarding;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_candidates_applied_at ON candidates(applied_at);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);
CREATE INDEX IF NOT EXISTS idx_interviews_scheduled_at ON interviews(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_onboarding_status ON onboarding_tasks(status);
CREATE INDEX IF NOT EXISTS idx_offboarding_status ON offboarding_tasks(status);
