import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Search,
  Upload,
  FileText,
  File,
  FileCheck,
  FileBadge,
  MoreHorizontal,
  Download,
  Trash2,
  Eye,
  Loader2,
  X,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
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
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const typeIcons: Record<string, React.ReactNode> = {
  resume: <FileText className="h-5 w-5" />,
  contract: <FileCheck className="h-5 w-5" />,
  policy: <FileBadge className="h-5 w-5" />,
  certificate: <FileBadge className="h-5 w-5" />,
  other: <File className="h-5 w-5" />,
};

const typeColors: Record<string, string> = {
  resume: 'text-blue-600 bg-blue-500/10',
  contract: 'text-green-600 bg-green-500/10',
  policy: 'text-purple-600 bg-purple-500/10',
  certificate: 'text-orange-600 bg-orange-500/10',
  other: 'text-gray-600 bg-gray-500/10',
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function Documents() {
  const [search, setSearch] = useState('');
const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading, error } = useQuery({
    queryKey: ['documents'],
    queryFn: () => api.getDocuments(),
  });

const createMutation = useMutation({
    mutationFn: (data: any) => api.createDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setIsUploadDialogOpen(false);
      setFormData({});
      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload document',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: 'Success',
        description: 'Document deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete document',
        variant: 'destructive',
      });
    },
  });

  const handleUploadDocument = () => {
    if (!formData.name || !formData.type) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    createMutation.mutate({
      ...formData,
      uploadedBy: 'Current User',
      size: Math.floor(Math.random() * 5000000),
      url: '#',
    });
  };

  const handleDownload = async (id: string, name: string) => {
    try {
      const blob = await api.downloadDocument(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download document',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDocument = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground mt-1">
            Manage HR documents, policies, and employee files
          </p>
        </div>
<Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Fill in the document details below
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="docName">Document Name *</Label>
                <Input
                  id="docName"
                  value={formData.name || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Document name"
                />
              </div>
              <div>
                <Label htmlFor="docType">Document Type *</Label>
                <Select
                  value={formData.type || ''}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resume">Resume</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="policy">Policy</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="docFile">File</Label>
                <Input
                  id="docFile"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, fileName: file.name })
                    }
                  }}
                />
              </div>
              <Button
                onClick={handleUploadDocument}
                disabled={createMutation.isPending}
                className="w-full"
              >
                {createMutation.isPending ? 'Uploading...' : 'Upload Document'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-destructive">
              <p>Failed to load documents. Please try again.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={cn('p-2 rounded-lg', typeColors[doc.type])}>
                        {typeIcons[doc.type]}
                      </div>
                      <span className="font-medium">{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {doc.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatFileSize(doc.size)}
                  </TableCell>
                  <TableCell>{doc.uploadedBy}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDownload(doc.id, doc.name)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
<DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
