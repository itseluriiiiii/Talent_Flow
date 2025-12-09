import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Plus, Mail, Phone, MoreHorizontal, Building2, Loader2, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const statusColors: Record<string, string> = {
  active: 'bg-green-500/10 text-green-600 border-green-500/20',
  onboarding: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  offboarding: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  inactive: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
};

export default function Employees() {
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: employees = [], isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: () => api.getEmployees(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsAddDialogOpen(false);
      setFormData({});
      toast({
        title: 'Success',
        description: 'Employee added successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add employee',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.updateEmployee(editingEmployee.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setEditingEmployee(null);
      setFormData({});
      toast({
        title: 'Success',
        description: 'Employee updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update employee',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: 'Success',
        description: 'Employee deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete employee',
        variant: 'destructive',
      });
    },
  });

  const departments = [...new Set(employees.map((e) => e.department))];

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.position.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment =
      departmentFilter === 'all' || employee.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const handleAddEmployee = () => {
    if (!formData.name || !formData.email || !formData.position) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    createMutation.mutate(formData);
  };

  const handleUpdateEmployee = () => {
    if (!formData.name || !formData.email || !formData.position) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    updateMutation.mutate(formData);
  };

  const handleEditEmployee = (employee: any) => {
    setEditingEmployee(employee);
    setFormData(employee);
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-muted-foreground mt-1">
            Manage your team members and their information
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Fill in the employee details below
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Email address"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Phone number"
                />
              </div>
              <div>
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={formData.position || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  placeholder="Job position"
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  placeholder="Department"
                />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <Button
                onClick={handleAddEmployee}
                disabled={createMutation.isPending}
                className="w-full"
              >
                {createMutation.isPending ? 'Adding...' : 'Add Employee'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="p-8 text-center text-destructive">
          <p>Failed to load employees. Please try again.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {employee.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditEmployee(employee)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteEmployee(employee.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{employee.department}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{employee.email}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={cn('capitalize', statusColors[employee.status])}
                >
                  {employee.status}
                </Badge>
                {employee.performanceScore && (
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">Performance:</span>
                    <span className="font-semibold text-primary">
                      {employee.performanceScore.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {employee.skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1">
                  {employee.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {employee.skills.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{employee.skills.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      {editingEmployee && (
        <Dialog
          open={!!editingEmployee}
          onOpenChange={(open) => {
            if (!open) {
              setEditingEmployee(null);
              setFormData({});
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
              <DialogDescription>
                Update the employee details below
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Full name"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Email address"
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Phone number"
                />
              </div>
              <div>
                <Label htmlFor="edit-position">Position *</Label>
                <Input
                  id="edit-position"
                  value={formData.position || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  placeholder="Job position"
                />
              </div>
              <div>
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  value={formData.department || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  placeholder="Department"
                />
              </div>
              <Button
                onClick={handleUpdateEmployee}
                disabled={updateMutation.isPending}
                className="w-full"
              >
                {updateMutation.isPending ? 'Updating...' : 'Update Employee'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
