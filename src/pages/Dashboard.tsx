import { useQuery } from '@tanstack/react-query';
import { Users, UserPlus, Briefcase, Clock, Loader2 } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentCandidates } from '@/components/dashboard/RecentCandidates';
import { UpcomingInterviews } from '@/components/dashboard/UpcomingInterviews';
import { HiringChart } from '@/components/dashboard/HiringChart';
import { DepartmentMetrics } from '@/components/dashboard/DepartmentMetrics';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => api.getAnalytics(),
  });

  if (isLoading || !analyticsData) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your hiring pipeline today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={analyticsData.totalEmployees}
          change={8}
          trend="up"
          icon={<Users className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="New Hires (This Month)"
          value={analyticsData.newHires}
          change={25}
          trend="up"
          icon={<UserPlus className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Open Positions"
          value={analyticsData.openPositions}
          change={-12}
          trend="down"
          icon={<Briefcase className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Avg. Time to Hire"
          value={`${analyticsData.avgTimeToHire} days`}
          change={-15}
          trend="down"
          icon={<Clock className="h-5 w-5 text-primary" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <HiringChart />
        <DepartmentMetrics />
      </div>

      {/* Activity Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentCandidates />
        <UpcomingInterviews />
      </div>
    </div>
  );
}
