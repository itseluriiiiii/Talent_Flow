import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar,
  Video,
  Phone,
  Building,
  Sparkles,
  Plus,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Loader2,
  Edit,
  MessageSquare,
  Star,
  Play,
  Users,
  Mic,
  MicOff,
  VideoOff,
  Settings,
} from 'lucide-react';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const typeIcons: Record<string, React.ReactNode> = {
  video: <Video className="h-4 w-4" />,
  phone: <Phone className="h-4 w-4" />,
  onsite: <Building className="h-4 w-4" />,
  ai: <Sparkles className="h-4 w-4" />,
};

const typeColors: Record<string, string> = {
  video: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  phone: 'bg-green-500/10 text-green-600 border-green-500/20',
  onsite: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  ai: 'bg-accent/10 text-accent border-accent/20',
};

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-500/10 text-blue-600',
  completed: 'bg-green-500/10 text-green-600',
  cancelled: 'bg-red-500/10 text-red-600',
};

export default function Interviews() {
  const [tab, setTab] = useState('upcoming');
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isAIInterviewDialogOpen, setIsAIInterviewDialogOpen] = useState(false);
  const [isJoinInterviewDialogOpen, setIsJoinInterviewDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [feedbackData, setFeedbackData] = useState<any>({});
  const [aiInterviewSettings, setAiInterviewSettings] = useState<any>({
    difficulty: 'medium',
    duration: 30,
    questionTypes: ['technical', 'behavioral'],
  });
  const [joinSettings, setJoinSettings] = useState<any>({
    cameraEnabled: true,
    micEnabled: true,
    screenShareEnabled: false,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: interviews = [], isLoading, error } = useQuery({
    queryKey: ['interviews'],
    queryFn: () => api.getInterviews(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createInterview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      setIsScheduleDialogOpen(false);
      setFormData({});
      toast({
        title: 'Success',
        description: 'Interview scheduled successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to schedule interview',
        variant: 'destructive',
      });
    },
  });

  const rescheduleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateInterview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      setIsRescheduleDialogOpen(false);
      setSelectedInterview(null);
      setFormData({});
      toast({
        title: 'Success',
        description: 'Interview rescheduled successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reschedule interview',
        variant: 'destructive',
      });
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: ({ id, feedback }: { id: string; feedback: any }) => api.addInterviewFeedback(id, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      setIsFeedbackDialogOpen(false);
      setSelectedInterview(null);
      setFeedbackData({});
      toast({
        title: 'Success',
        description: 'Feedback added successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add feedback',
        variant: 'destructive',
      });
    },
  });

  const handleScheduleInterview = () => {
    if (!formData.candidateName || !formData.scheduledAt || !formData.type) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    createMutation.mutate({
      ...formData,
      duration: parseInt(formData.duration) || 60,
      interviewers: formData.interviewers ? formData.interviewers.split(',').map((i: string) => i.trim()) : [],
    });
  };

  const handleRescheduleInterview = () => {
    if (!selectedInterview || !formData.scheduledAt) {
      toast({
        title: 'Error',
        description: 'Please select a new date and time',
        variant: 'destructive',
      });
      return;
    }
    rescheduleMutation.mutate({
      id: selectedInterview.id,
      data: {
        ...selectedInterview,
        scheduledAt: formData.scheduledAt,
        duration: parseInt(formData.duration) || selectedInterview.duration,
        interviewers: formData.interviewers ? formData.interviewers.split(',').map((i: string) => i.trim()) : selectedInterview.interviewers,
      },
    });
  };

  const handleAddFeedback = () => {
    if (!selectedInterview || !feedbackData.rating || !feedbackData.recommendation) {
      toast({
        title: 'Error',
        description: 'Please provide rating and recommendation',
        variant: 'destructive',
      });
      return;
    }
    feedbackMutation.mutate({
      id: selectedInterview.id,
      feedback: {
        rating: parseInt(feedbackData.rating),
        recommendation: feedbackData.recommendation,
        notes: feedbackData.notes || '',
      },
    });
  };

  const openRescheduleDialog = (interview: any) => {
    setSelectedInterview(interview);
    setFormData({
      scheduledAt: interview.scheduledAt,
      duration: interview.duration.toString(),
      interviewers: interview.interviewers.join(', '),
    });
    setIsRescheduleDialogOpen(true);
  };

  const openFeedbackDialog = (interview: any) => {
    setSelectedInterview(interview);
    setFeedbackData({
      rating: interview.feedback?.rating?.toString() || '3',
      recommendation: interview.feedback?.recommendation || '',
      notes: interview.feedback?.notes || '',
    });
    setIsFeedbackDialogOpen(true);
  };

  const openAIInterviewDialog = (interview: any) => {
    setSelectedInterview(interview);
    setIsAIInterviewDialogOpen(true);
  };

  const openJoinInterviewDialog = (interview: any) => {
    setSelectedInterview(interview);
    setIsJoinInterviewDialogOpen(true);
  };

  const handleStartAIInterview = () => {
    if (!selectedInterview) return;
    
    toast({
      title: 'Starting AI Interview',
      description: 'Initializing AI interview session...',
    });
    
    // Simulate starting AI interview
    setTimeout(() => {
      setIsAIInterviewDialogOpen(false);
      toast({
        title: 'AI Interview Started',
        description: 'AI interview session has been initiated successfully.',
      });
    }, 2000);
  };

  const handleJoinInterview = () => {
    if (!selectedInterview) return;
    
    toast({
      title: 'Joining Interview',
      description: 'Connecting to interview room...',
    });
    
    // Simulate joining interview
    setTimeout(() => {
      setIsJoinInterviewDialogOpen(false);
      toast({
        title: 'Joined Interview',
        description: 'Successfully joined the interview room.',
      });
    }, 2000);
  };

  const scheduledInterviews = interviews.filter((i) => i.status === 'scheduled');
  const completedInterviews = interviews.filter((i) => i.status === 'completed');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Interviews</h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage candidate interviews
          </p>
        </div>
        <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Schedule Interview
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Interview</DialogTitle>
              <DialogDescription>
                Fill in the interview details below
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="candidateName">Candidate Name *</Label>
                <Input
                  id="candidateName"
                  value={formData.candidateName || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, candidateName: e.target.value })
                  }
                  placeholder="Candidate name"
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
                <Label htmlFor="scheduledAt">Date & Time *</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={formData.scheduledAt || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledAt: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration || '60'}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="60"
                />
              </div>
              <div>
                <Label htmlFor="type">Interview Type *</Label>
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
                    <SelectItem value="video">Video Call</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                    <SelectItem value="ai">AI Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="interviewers">Interviewers (comma-separated)</Label>
                <Input
                  id="interviewers"
                  value={formData.interviewers || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, interviewers: e.target.value })
                  }
                  placeholder="John Smith, Jane Doe"
                />
              </div>
              <Button
                onClick={handleScheduleInterview}
                disabled={createMutation.isPending}
                className="w-full"
              >
                {createMutation.isPending ? 'Scheduling...' : 'Schedule Interview'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="upcoming" className="gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming ({scheduledInterviews.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed ({completedInterviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-destructive">
              <p>Failed to load interviews. Please try again.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {scheduledInterviews.map((interview) => (
              <Card key={interview.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{interview.candidateName}</h3>
                      <p className="text-muted-foreground">{interview.position}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn('gap-1.5', typeColors[interview.type])}
                    >
                      {typeIcons[interview.type]}
                      <span className="capitalize">{interview.type}</span>
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(interview.scheduledAt), 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(new Date(interview.scheduledAt), 'h:mm a')} ({interview.duration} min)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{interview.interviewers.join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-2"
                      onClick={() => openRescheduleDialog(interview)}
                    >
                      <Edit className="h-4 w-4" />
                      Reschedule
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 gap-2"
                      onClick={() => interview.type === 'ai' ? openAIInterviewDialog(interview) : openJoinInterviewDialog(interview)}
                    >
                      {interview.type === 'ai' ? <Play className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                      {interview.type === 'ai' ? 'Start AI Interview' : 'Join'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-destructive">
              <p>Failed to load interviews. Please try again.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {completedInterviews.map((interview) => (
              <Card key={interview.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{interview.candidateName}</h3>
                      <p className="text-muted-foreground">{interview.position}</p>
                    </div>
                    <Badge className={statusColors.completed}>
                      Completed
                    </Badge>
                  </div>

                  {interview.feedback && (
                    <div className="space-y-3 p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Rating</span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={cn(
                                'text-lg',
                                i < interview.feedback!.rating ? 'text-warning' : 'text-muted'
                              )}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Recommendation</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            'ml-2 capitalize',
                            interview.feedback.recommendation.includes('hire')
                              ? 'text-success border-success/30'
                              : 'text-destructive border-destructive/30'
                          )}
                        >
                          {interview.feedback.recommendation.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {interview.feedback.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-2"
                      onClick={() => openFeedbackDialog(interview)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      {interview.feedback ? 'Edit Feedback' : 'Add Feedback'}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Reschedule Modal */}
      <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Interview</DialogTitle>
            <DialogDescription>
              Update the interview details for {selectedInterview?.candidateName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rescheduleDate">New Date & Time *</Label>
              <Input
                id="rescheduleDate"
                type="datetime-local"
                value={formData.scheduledAt || ''}
                onChange={(e) =>
                  setFormData({ ...formData, scheduledAt: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="rescheduleDuration">Duration (minutes)</Label>
              <Input
                id="rescheduleDuration"
                type="number"
                value={formData.duration || '60'}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                placeholder="60"
              />
            </div>
            <div>
              <Label htmlFor="rescheduleInterviewers">Interviewers (comma-separated)</Label>
              <Input
                id="rescheduleInterviewers"
                value={formData.interviewers || ''}
                onChange={(e) =>
                  setFormData({ ...formData, interviewers: e.target.value })
                }
                placeholder="John Smith, Jane Doe"
              />
            </div>
            <Button
              onClick={handleRescheduleInterview}
              disabled={rescheduleMutation.isPending}
              className="w-full"
            >
              {rescheduleMutation.isPending ? 'Rescheduling...' : 'Reschedule Interview'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Interview Feedback</DialogTitle>
            <DialogDescription>
              Provide feedback for {selectedInterview?.candidateName}'s interview
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rating">Rating *</Label>
              <Select
                value={feedbackData.rating || ''}
                onValueChange={(value) =>
                  setFeedbackData({ ...feedbackData, rating: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Poor</SelectItem>
                  <SelectItem value="2">2 - Below Average</SelectItem>
                  <SelectItem value="3">3 - Average</SelectItem>
                  <SelectItem value="4">4 - Good</SelectItem>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="recommendation">Recommendation *</Label>
              <Select
                value={feedbackData.recommendation || ''}
                onValueChange={(value) =>
                  setFeedbackData({ ...feedbackData, recommendation: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recommendation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strong_hire">Strong Hire</SelectItem>
                  <SelectItem value="hire">Hire</SelectItem>
                  <SelectItem value="not_sure">Not Sure</SelectItem>
                  <SelectItem value="no_hire">No Hire</SelectItem>
                  <SelectItem value="strong_no_hire">Strong No Hire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={feedbackData.notes || ''}
                onChange={(e) =>
                  setFeedbackData({ ...feedbackData, notes: e.target.value })
                }
                placeholder="Provide detailed feedback about the candidate..."
                rows={4}
              />
            </div>
            <Button
              onClick={handleAddFeedback}
              disabled={feedbackMutation.isPending}
              className="w-full"
            >
              {feedbackMutation.isPending ? 'Saving...' : 'Save Feedback'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Interview Modal */}
      <Dialog open={isAIInterviewDialogOpen} onOpenChange={setIsAIInterviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Start AI Interview
            </DialogTitle>
            <DialogDescription>
              Configure AI interview settings for {selectedInterview?.candidateName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select
                  value={aiInterviewSettings.difficulty}
                  onValueChange={(value) =>
                    setAiInterviewSettings({ ...aiInterviewSettings, difficulty: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={aiInterviewSettings.duration}
                  onChange={(e) =>
                    setAiInterviewSettings({ ...aiInterviewSettings, duration: parseInt(e.target.value) })
                  }
                  min="15"
                  max="120"
                />
              </div>
            </div>

            <div>
              <Label>Question Types</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['technical', 'behavioral', 'situational', 'problem-solving'].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={type}
                      checked={aiInterviewSettings.questionTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAiInterviewSettings({
                            ...aiInterviewSettings,
                            questionTypes: [...aiInterviewSettings.questionTypes, type],
                          });
                        } else {
                          setAiInterviewSettings({
                            ...aiInterviewSettings,
                            questionTypes: aiInterviewSettings.questionTypes.filter((t: string) => t !== type),
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <Label htmlFor={type} className="capitalize">
                      {type.replace('-', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-accent/10 rounded-lg">
              <h4 className="font-medium mb-2">AI Interview Preview</h4>
              <p className="text-sm text-muted-foreground mb-3">
                The AI will conduct a {aiInterviewSettings.duration}-minute interview with {aiInterviewSettings.difficulty} difficulty level.
              </p>
              <div className="flex flex-wrap gap-1">
                {aiInterviewSettings.questionTypes.map((type: string) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type.replace('-', ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsAIInterviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleStartAIInterview} className="flex-1 gap-2">
                <Play className="h-4 w-4" />
                Start AI Interview
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Join Interview Modal */}
      <Dialog open={isJoinInterviewDialogOpen} onOpenChange={setIsJoinInterviewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Join Interview
            </DialogTitle>
            <DialogDescription>
              Join {selectedInterview?.candidateName}'s {selectedInterview?.type} interview
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Candidate:</span>
                  <span className="text-sm">{selectedInterview?.candidateName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Position:</span>
                  <span className="text-sm">{selectedInterview?.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Type:</span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {selectedInterview?.type}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <Label>Audio & Video Settings</Label>
              <div className="space-y-3 mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    <span className="text-sm">Camera</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setJoinSettings({ ...joinSettings, cameraEnabled: !joinSettings.cameraEnabled })}
                  >
                    {joinSettings.cameraEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    <span className="text-sm">Microphone</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setJoinSettings({ ...joinSettings, micEnabled: !joinSettings.micEnabled })}
                  >
                    {joinSettings.micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {selectedInterview?.type === 'video' 
                  ? 'Click "Join Now" to enter the video conference room.'
                  : selectedInterview?.type === 'phone'
                  ? 'Click "Join Now" to receive the call details.'
                  : 'Click "Join Now" to view the on-site interview details.'
                }
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsJoinInterviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleJoinInterview} className="flex-1 gap-2">
                <Users className="h-4 w-4" />
                Join Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
