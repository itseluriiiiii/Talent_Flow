export type UserRole = 'hr' | 'manager' | 'employee';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  aiScore: number;
  skills: string[];
  experience: number;
  resumeUrl?: string;
  appliedAt: string;
  notes?: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  position: string;
  scheduledAt: string;
  duration: number;
  type: 'phone' | 'video' | 'onsite' | 'ai';
  status: 'scheduled' | 'completed' | 'cancelled';
  interviewers: string[];
  feedback?: InterviewFeedback;
}

export interface InterviewFeedback {
  rating: number;
  strengths: string[];
  weaknesses: string[];
  recommendation: 'strong_hire' | 'hire' | 'no_hire' | 'strong_no_hire';
  notes: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  manager?: string;
  startDate: string;
  status: 'active' | 'onboarding' | 'offboarding' | 'inactive';
  avatar?: string;
  skills: string[];
  performanceScore?: number;
}

export interface OnboardingTask {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  category: 'documentation' | 'training' | 'equipment' | 'introduction' | 'compliance';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  assignedTo?: string;
}

export interface OffboardingTask {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  category: 'exit_interview' | 'asset_return' | 'knowledge_transfer' | 'access_revoke' | 'final_pay';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  assignedTo?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'resume' | 'contract' | 'policy' | 'certificate' | 'other';
  uploadedBy: string;
  uploadedAt: string;
  size: number;
  url: string;
  employeeId?: string;
}

export interface DepartmentMetrics {
  name: string;
  headcount: number;
  openPositions: number;
  avgPerformance: number;
  turnoverRate: number;
}

export interface AnalyticsData {
  totalEmployees: number;
  newHires: number;
  openPositions: number;
  avgTimeToHire: number;
  turnoverRate: number;
  departmentMetrics: DepartmentMetrics[];
  hiringTrend: { month: string; hires: number; departures: number }[];
}
