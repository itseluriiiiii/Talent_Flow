import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Loader2,
  Trash2,
  Edit,
  ExternalLink,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Candidate {
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
  resumeUrl: string;
  appliedAt: string;
  notes: string;
}

interface CandidatesResponse {
  success: boolean;
  data: Candidate[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  screening: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  interview: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  offer: 'bg-green-500/10 text-green-600 border-green-500/20',
  hired: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export default function CandidatesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState('appliedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [formData, setFormData] = useState<Partial<Candidate>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch candidates
  const { data: candidatesData, isLoading, error } = useQuery({
    queryKey: ['candidates', search, statusFilter, departmentFilter, sortBy, sortOrder, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (departmentFilter !== 'all') params.append('department', departmentFilter);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      params.append('page', page.toString());
      params.append('limit', '10');

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/candidates?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }

      return response.json() as Promise<CandidatesResponse>;
    },
  });

  // Create candidate mutation
  const createMutation = useMutation({
    mutationFn: async (data: Partial<Candidate>) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/candidates`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.errors?.[0] || 'Failed to add candidate');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      setIsAddDialogOpen(false);
      setFormData({});
      toast({
        title: 'Success',
        description: 'Candidate added successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add candidate',
        variant: 'destructive',
      });
    },
  });

  // Update candidate mutation
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Candidate>) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/candidates/${editingCandidate?.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.errors?.[0] || 'Failed to update candidate');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      setEditingCandidate(null);
      setFormData({});
      toast({
        title: 'Success',
        description: 'Candidate updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update candidate',
        variant: 'destructive',
      });
    },
  });

  // Delete candidate mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/candidates/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete candidate');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast({
        title: 'Success',
        description: 'Candidate deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete candidate',
        variant: 'destructive',
      });
    },
  });

  const handleAddCandidate = async () => {
    if (!formData.name || !formData.email || !formData.position) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    try {
      await createMutation.mutateAsync(formData);
      setFormData({});
    } catch (error) {
      console.error('Error adding candidate:', error);
    }
  };

  const handleUpdateCandidate = () => {
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

  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setFormData(candidate);
  };

  const handleDeleteCandidate = (id: string) => {
    if (confirm('Are you sure you want to delete this candidate?')) {
      deleteMutation.mutate(id);
    }
  };

  const departments = candidatesData?.data
    ? [...new Set(candidatesData.data.map((c) => c.department))]
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        <p>Failed to load candidates. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Candidates</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your candidate pipeline
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Candidate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Candidate</DialogTitle>
              <DialogDescription>
                Fill in the candidate details below
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
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || 'new'}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value as Candidate['status'],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="screening">Screening</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Additional notes"
                />
              </div>
              <Button
                onClick={handleAddCandidate}
                disabled={createMutation.isPending}
                className="w-full"
              >
                {createMutation.isPending ? 'Adding...' : 'Add Candidate'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 items-end">
            <div className="relative flex-1 lg:flex-[2]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px] lg:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={departmentFilter}
              onValueChange={(value) => {
                setDepartmentFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px] lg:w-[200px]">
                <SelectValue placeholder="Filter by department" />
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
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px] lg:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="appliedAt">Applied Date</SelectItem>
                <SelectItem value="position">Position</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="w-full sm:w-auto lg:w-auto"
            >
              {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidatesData?.data && candidatesData.data.length > 0 ? (
                  candidatesData.data.map((candidate) => (
                    <TableRow key={candidate.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{candidate.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {candidate.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{candidate.position}</p>
                          {candidate.phone && (
                            <p className="text-sm text-muted-foreground">
                              {candidate.phone}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{candidate.department}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn('capitalize', statusColors[candidate.status])}
                        >
                          {candidate.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(candidate.appliedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            {candidate.resumeUrl && (
                              <DropdownMenuItem>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Resume
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleEditCandidate(candidate)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteCandidate(candidate.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">No candidates found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {candidatesData?.pagination && candidatesData.pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * 10 + 1} to{' '}
            {Math.min(page * 10, candidatesData.pagination.total)} of{' '}
            {candidatesData.pagination.total} candidates
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setPage(Math.min(candidatesData.pagination.pages, page + 1))
              }
              disabled={page === candidatesData.pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {editingCandidate && (
        <Dialog
          open={!!editingCandidate}
          onOpenChange={(open) => {
            if (!open) {
              setEditingCandidate(null);
              setFormData({});
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Candidate</DialogTitle>
              <DialogDescription>
                Update the candidate details below
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
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status || 'new'}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value as Candidate['status'],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="screening">Screening</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Additional notes"
                />
              </div>
              <Button
                onClick={handleUpdateCandidate}
                disabled={updateMutation.isPending}
                className="w-full"
              >
                {updateMutation.isPending ? 'Updating...' : 'Update Candidate'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
