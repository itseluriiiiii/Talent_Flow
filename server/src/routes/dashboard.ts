import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Mock data for dashboard stats (replace with real DB queries)
const getMockDashboardStats = () => {
  return {
    totalEmployees: 156,
    newCandidatesMonth: 24,
    completedInterviewsMonth: 18,
    activeOnboardingTasks: 12,
    employeesOnboarding: 3,
    candidatesInInterview: 7,
    avgPerformanceScore: 4.2,
    employeesOffboarding: 1,
    departmentBreakdown: [
      { name: 'Engineering', count: 52, openPositions: 4 },
      { name: 'Product', count: 18, openPositions: 2 },
      { name: 'Design', count: 12, openPositions: 1 },
      { name: 'Marketing', count: 24, openPositions: 1 },
      { name: 'Sales', count: 35, openPositions: 0 },
      { name: 'Operations', count: 15, openPositions: 0 },
    ],
    hiringTrend: [
      { month: 'Aug', hires: 5, departures: 2 },
      { month: 'Sep', hires: 8, departures: 3 },
      { month: 'Oct', hires: 6, departures: 4 },
      { month: 'Nov', hires: 10, departures: 2 },
      { month: 'Dec', hires: 4, departures: 5 },
      { month: 'Jan', hires: 12, departures: 3 },
    ],
    recentCandidates: [
      { id: 1, name: 'Alex Chen', position: 'Senior Software Engineer', status: 'interview', appliedAt: '2024-01-15' },
      { id: 2, name: 'Maria Garcia', position: 'Product Manager', status: 'screening', appliedAt: '2024-01-18' },
      { id: 3, name: 'James Wilson', position: 'UX Designer', status: 'new', appliedAt: '2024-01-20' },
      { id: 4, name: 'Emily Brown', position: 'Data Scientist', status: 'offer', appliedAt: '2024-01-10' },
      { id: 5, name: 'Michael Lee', position: 'DevOps Engineer', status: 'rejected', appliedAt: '2024-01-12' },
    ],
    upcomingInterviews: [
      { id: 1, candidateName: 'Alex Chen', position: 'Senior Software Engineer', scheduledAt: '2024-01-25T10:00:00', type: 'video' },
      { id: 2, candidateName: 'Maria Garcia', position: 'Product Manager', scheduledAt: '2024-01-26T14:00:00', type: 'ai' },
      { id: 3, candidateName: 'James Wilson', position: 'UX Designer', scheduledAt: '2024-01-27T11:00:00', type: 'onsite' },
    ],
    onboardingProgress: [
      { employeeName: 'David Park', position: 'Product Designer', progress: 40, tasksCompleted: 2, totalTasks: 5 },
      { employeeName: 'Sarah Chen', position: 'Junior Developer', progress: 60, tasksCompleted: 3, totalTasks: 5 },
      { employeeName: 'John Doe', position: 'Marketing Specialist', progress: 20, tasksCompleted: 1, totalTasks: 5 },
    ],
  };
};

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', authMiddleware, (req, res) => {
  try {
    const stats = getMockDashboardStats();
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats',
    });
  }
});

// GET /api/dashboard/stats/refresh - Refresh stats (for real-time updates)
router.get('/stats/refresh', authMiddleware, (req, res) => {
  try {
    const stats = getMockDashboardStats();
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Dashboard refresh error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh dashboard stats',
    });
  }
});

export default router;
