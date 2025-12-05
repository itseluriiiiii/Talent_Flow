import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { candidates } from '@/data/mockData';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  screening: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  interview: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  offer: 'bg-green-500/10 text-green-600 border-green-500/20',
  hired: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export function RecentCandidates() {
  const recentCandidates = candidates.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Recent Candidates</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/candidates" className="gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {candidate.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{candidate.name}</p>
                  <p className="text-sm text-muted-foreground">{candidate.position}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">AI Score</span>
                    <span
                      className={cn(
                        'text-sm font-bold',
                        candidate.aiScore >= 90 ? 'text-success' :
                        candidate.aiScore >= 80 ? 'text-primary' :
                        candidate.aiScore >= 70 ? 'text-warning' : 'text-destructive'
                      )}
                    >
                      {candidate.aiScore}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn('capitalize', statusColors[candidate.status])}
                >
                  {candidate.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
