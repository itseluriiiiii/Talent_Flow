import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  UserPlus,
  CheckCircle,
  Clock,
  TrendingUp,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

interface DashboardStats {
  totalEmployees: number;
  newCandidatesMonth: number;
  completedInterviewsMonth: number;
  activeOnboardingTasks: number;
  employeesOnboarding: number;
  candidatesInInterview: number;
  avgPerformanceScore: number;
  employeesOffboarding: number;
  departmentBreakdown: Array<{
    name: string;
    count: number;
    openPositions: number;
  }>;
  hiringTrend: Array<{
    month: string;
    hires: number;
    departures: number;
  }>;
  recentCandidates: Array<{
    id: number;
    name: string;
    position: string;
    status: string;
    appliedAt: string;
  }>;
  upcomingInterviews: Array<{
    id: number;
    candidateName: string;
    position: string;
    scheduledAt: string;
    type: string;
  }>;
  onboardingProgress: Array<{
    employeeName: string;
    position: string;
    progress: number;
    tasksCompleted: number;
    totalTasks: number;
  }>;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  description,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  description?: string;
}) => (
  <Card className="overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{Icon}</div>
      </div>
    </CardContent>
  </Card>
);

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-600',
  screening: 'bg-yellow-500/10 text-yellow-600',
  interview: 'bg-purple-500/10 text-purple-600',
  offer: 'bg-green-500/10 text-green-600',
  hired: 'bg-emerald-500/10 text-emerald-600',
  rejected: 'bg-red-500/10 text-red-600',
};

export default function HRDashboard() {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const { data: dashboardData, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/dashboard/stats`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      return response.json();
    },
    refetchInterval: 10000, // Auto-refresh every 10 seconds
  });

  // Manual refresh handler
  const handleRefresh = async () => {
    setLastRefresh(new Date());
    await refetch();
  };

  useEffect(() => {
    // Set up auto-refresh interval
    const interval = setInterval(() => {
      refetch();
      setLastRefresh(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="p-8 text-center text-destructive">
        <p>Failed to load dashboard. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">HR Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time HR metrics and analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={dashboardData.totalEmployees}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          color="bg-blue-500/10"
          description="Active employees"
        />
        <StatCard
          title="New Candidates"
          value={dashboardData.newCandidatesMonth}
          icon={<UserPlus className="h-6 w-6 text-green-600" />}
          color="bg-green-500/10"
          description="This month"
        />
        <StatCard
          title="Completed Interviews"
          value={dashboardData.completedInterviewsMonth}
          icon={<CheckCircle className="h-6 w-6 text-purple-600" />}
          color="bg-purple-500/10"
          description="This month"
        />
        <StatCard
          title="Active Onboarding"
          value={dashboardData.activeOnboardingTasks}
          icon={<Clock className="h-6 w-6 text-orange-600" />}
          color="bg-orange-500/10"
          description="Tasks pending"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Hiring Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Hiring Trend</CardTitle>
            <CardDescription>Hires vs Departures</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.hiringTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="hires"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Hires"
                />
                <Line
                  type="monotone"
                  dataKey="departures"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Departures"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Department Breakdown</CardTitle>
            <CardDescription>Employees by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.departmentBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, count }) => `${name}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {dashboardData.departmentBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Department Details */}
        <Card>
          <CardHeader>
            <CardTitle>Department Details</CardTitle>
            <CardDescription>Headcount and open positions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.departmentBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Employees" />
                <Bar dataKey="openPositions" fill="#f59e0b" name="Open Positions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Additional metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Avg Performance Score</span>
              <span className="text-lg font-bold">
                {dashboardData.avgPerformanceScore.toFixed(1)}/5.0
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Employees Onboarding</span>
              <Badge variant="outline">{dashboardData.employeesOnboarding}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Candidates in Interview</span>
              <Badge variant="outline">{dashboardData.candidatesInInterview}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Employees Offboarding</span>
              <Badge variant="outline" className="bg-red-500/10 text-red-600">
                {dashboardData.employeesOffboarding}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Recent Candidates */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Candidates</CardTitle>
            <CardDescription>Latest applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.recentCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell className="text-sm">{candidate.position}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusColors[candidate.status] || ''}
                        >
                          {candidate.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Interviews */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
            <CardDescription>Next scheduled interviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.upcomingInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{interview.candidateName}</p>
                    <p className="text-xs text-muted-foreground">
                      {interview.position}
                    </p>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {interview.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Progress</CardTitle>
          <CardDescription>Employee onboarding status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {dashboardData.onboardingProgress.map((employee, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{employee.employeeName}</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.position}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    {employee.tasksCompleted}/{employee.totalTasks} tasks
                  </span>
                </div>
                <Progress value={employee.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
