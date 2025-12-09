import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  MessageSquare,
  Package,
  BookOpen,
  KeyRound,
  DollarSign,
  Calendar,
  Plus,
  UserMinus,
  Loader2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
  const [isStartDialogOpen, setIsStartDialogOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: () => api.getEmployees(),
  });

  const { data: offboardingTasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['offboarding'],
    queryFn: () => api.getOffboardingTasks(),
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: any) => api.createOffboardingTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offboarding'] });
      setIsStartDialogOpen(false);
      setFormData({});
      toast({
        title: 'Success',
        description: 'Offboarding started successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to start offboarding',
        variant: 'destructive',
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: any) => api.updateOffboardingTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offboarding'] });
      toast({
        title: 'Success',
        description: 'Task updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update task',
        variant: 'destructive',
      });
    },
  });

  const handleStartOffboarding = () => {
    if (!formData.employeeId || !formData.title) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    createTaskMutation.mutate({
      ...formData,
      status: 'pending',
      dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
    });
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: string) => {
    updateTaskMutation.mutate({
      id: taskId,
      data: { status: newStatus },
    });
  };

  const isLoading = employeesLoading || tasksLoading;

  const offboardingEmployees = employees.filter((e) => e.status === 'offboarding');

  const getEmployeeTasks = (employeeId: string) =>
    offboardingTasks.filter((t) => t.employeeId === employeeId);

  const getProgress = (employeeId: string) => {
    const tasks = getEmployeeTasks(employeeId);
    const completed = tasks.filter((t) => t.status === 'completed').length;
    return tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
        <Dialog open={isStartDialogOpen} onOpenChange={setIsStartDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Start Offboarding
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start New Offboarding</DialogTitle>
              <DialogDescription>
                Create an offboarding task for an employee
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="employeeId">Employee *</Label>
                <Select
                  value={formData.employeeId || ''}
                  onValueChange={(value) =>
                    setFormData({ ...formData, employeeId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Task title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Task description"
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category || ''}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exit_interview">Exit Interview</SelectItem>
                    <SelectItem value="asset_return">Asset Return</SelectItem>
                    <SelectItem value="knowledge_transfer">Knowledge Transfer</SelectItem>
                    <SelectItem value="access_revoke">Access Revoke</SelectItem>
                    <SelectItem value="final_pay">Final Pay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                />
              </div>
              <Button
                onClick={handleStartOffboarding}
                disabled={createTaskMutation.isPending}
                className="w-full"
              >
                {createTaskMutation.isPending ? 'Starting...' : 'Start Offboarding'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
                        <Checkbox
                          checked={task.status === 'completed'}
                          onCheckedChange={(checked) =>
                            handleUpdateTaskStatus(
                              task.id,
                              checked ? 'completed' : 'pending'
                            )
                          }
                        />
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
