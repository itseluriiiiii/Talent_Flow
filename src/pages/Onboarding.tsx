import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FileText,
  GraduationCap,
  Monitor,
  Users,
  Shield,
  Calendar,
  Plus,
} from 'lucide-react';
import { employees, onboardingTasks } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const categoryIcons: Record<string, React.ReactNode> = {
  documentation: <FileText className="h-4 w-4" />,
  training: <GraduationCap className="h-4 w-4" />,
  equipment: <Monitor className="h-4 w-4" />,
  introduction: <Users className="h-4 w-4" />,
  compliance: <Shield className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  documentation: 'bg-blue-500/10 text-blue-600',
  training: 'bg-purple-500/10 text-purple-600',
  equipment: 'bg-orange-500/10 text-orange-600',
  introduction: 'bg-green-500/10 text-green-600',
  compliance: 'bg-red-500/10 text-red-600',
};

const statusColors: Record<string, string> = {
  pending: 'bg-gray-500/10 text-gray-600',
  in_progress: 'bg-blue-500/10 text-blue-600',
  completed: 'bg-green-500/10 text-green-600',
};

export default function Onboarding() {
  const onboardingEmployees = employees.filter((e) => e.status === 'onboarding');

  const getEmployeeTasks = (employeeId: string) =>
    onboardingTasks.filter((t) => t.employeeId === employeeId);

  const getProgress = (employeeId: string) => {
    const tasks = getEmployeeTasks(employeeId);
    const completed = tasks.filter((t) => t.status === 'completed').length;
    return tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Onboarding</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage new employee onboarding progress
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Start Onboarding
        </Button>
      </div>

      {/* Onboarding Cards */}
      <div className="grid gap-6">
        {onboardingEmployees.map((employee) => {
          const tasks = getEmployeeTasks(employee.id);
          const progress = getProgress(employee.id);

          return (
            <Card key={employee.id}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {employee.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{employee.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {employee.position} • {employee.department}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        Started {format(new Date(employee.startDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{Math.round(progress)}%</p>
                    <p className="text-sm text-muted-foreground">Complete</p>
                  </div>
                </div>
                <Progress value={progress} className="mt-4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg border',
                        task.status === 'completed' && 'bg-muted/30'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox checked={task.status === 'completed'} />
                        <div>
                          <p
                            className={cn(
                              'font-medium',
                              task.status === 'completed' && 'line-through text-muted-foreground'
                            )}
                          >
                            {task.title}
                          </p>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn(categoryColors[task.category], 'gap-1')}>
                          {categoryIcons[task.category]}
                          <span className="capitalize">{task.category}</span>
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn('capitalize', statusColors[task.status])}
                        >
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {onboardingEmployees.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No Active Onboarding</h3>
              <p className="text-muted-foreground mt-1">
                There are no employees currently being onboarded.
              </p>
              <Button className="mt-4">Start New Onboarding</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
