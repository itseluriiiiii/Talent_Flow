import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  MessageSquare,
  Package,
  BookOpen,
  KeyRound,
  DollarSign,
  Calendar,
  Plus,
  UserMinus,
} from 'lucide-react';
import { employees, offboardingTasks } from '@/data/mockData';
import { cn } from '@/lib/utils';

const categoryIcons: Record<string, React.ReactNode> = {
  exit_interview: <MessageSquare className="h-4 w-4" />,
  asset_return: <Package className="h-4 w-4" />,
  knowledge_transfer: <BookOpen className="h-4 w-4" />,
  access_revoke: <KeyRound className="h-4 w-4" />,
  final_pay: <DollarSign className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  exit_interview: 'bg-blue-500/10 text-blue-600',
  asset_return: 'bg-orange-500/10 text-orange-600',
  knowledge_transfer: 'bg-purple-500/10 text-purple-600',
  access_revoke: 'bg-red-500/10 text-red-600',
  final_pay: 'bg-green-500/10 text-green-600',
};

const statusColors: Record<string, string> = {
  pending: 'bg-gray-500/10 text-gray-600',
  in_progress: 'bg-blue-500/10 text-blue-600',
  completed: 'bg-green-500/10 text-green-600',
};

export default function Offboarding() {
  const offboardingEmployees = employees.filter((e) => e.status === 'offboarding');

  const getEmployeeTasks = (employeeId: string) =>
    offboardingTasks.filter((t) => t.employeeId === employeeId);

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
          <h1 className="text-3xl font-bold">Offboarding</h1>
          <p className="text-muted-foreground mt-1">
            Manage employee departures and ensure smooth transitions
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Start Offboarding
        </Button>
      </div>

      {/* Offboarding Cards */}
      <div className="grid gap-6">
        {offboardingEmployees.map((employee) => {
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
                      <Badge variant="outline" className="mt-2 text-orange-600 border-orange-500/30">
                        Departing Employee
                      </Badge>
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
                          {task.assignedTo && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Assigned to: {task.assignedTo}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn(categoryColors[task.category], 'gap-1')}>
                          {categoryIcons[task.category]}
                          <span className="capitalize">{task.category.replace('_', ' ')}</span>
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

        {offboardingEmployees.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <UserMinus className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No Active Offboarding</h3>
              <p className="text-muted-foreground mt-1">
                There are no employees currently being offboarded.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
