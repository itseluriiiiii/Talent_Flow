import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

  const { data: interviews = [], isLoading, error } = useQuery({
    queryKey: ['interviews'],
    queryFn: () => api.getInterviews(),
  });

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
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Schedule Interview
        </Button>
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
                    <Button variant="outline" size="sm" className="flex-1">
                      Reschedule
                    </Button>
                    <Button size="sm" className="flex-1">
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
    </div>
  );
}
