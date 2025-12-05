import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Video, Phone, Building, Sparkles, Calendar } from 'lucide-react';
import { interviews } from '@/data/mockData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const typeIcons: Record<string, React.ReactNode> = {
  video: <Video className="h-4 w-4" />,
  phone: <Phone className="h-4 w-4" />,
  onsite: <Building className="h-4 w-4" />,
  ai: <Sparkles className="h-4 w-4" />,
};

const typeColors: Record<string, string> = {
  video: 'bg-blue-500/10 text-blue-600',
  phone: 'bg-green-500/10 text-green-600',
  onsite: 'bg-purple-500/10 text-purple-600',
  ai: 'bg-accent/10 text-accent',
};

export function UpcomingInterviews() {
  const upcomingInterviews = interviews
    .filter((i) => i.status === 'scheduled')
    .slice(0, 4);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Upcoming Interviews</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/interviews" className="gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingInterviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>No upcoming interviews</p>
            </div>
          ) : (
            upcomingInterviews.map((interview) => (
              <div
                key={interview.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
              >
                <div className="space-y-1">
                  <p className="font-medium">{interview.candidateName}</p>
                  <p className="text-sm text-muted-foreground">{interview.position}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(new Date(interview.scheduledAt), 'MMM d, h:mm a')}
                  </div>
                </div>
                <Badge className={cn('gap-1.5', typeColors[interview.type])}>
                  {typeIcons[interview.type]}
                  <span className="capitalize">{interview.type}</span>
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
