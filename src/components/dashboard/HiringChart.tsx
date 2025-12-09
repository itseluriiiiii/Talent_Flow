import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { analyticsData } from '@/data/mockData';

export function HiringChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Hiring Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData.hiringTrend}>
              <defs>
                <linearGradient id="hires" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="departures" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                className="text-xs fill-muted-foreground"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs fill-muted-foreground"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="hires"
                name="New Hires"
                stroke="hsl(199, 89%, 48%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#hires)"
              />
              <Area
                type="monotone"
                dataKey="departures"
                name="Departures"
                stroke="hsl(0, 84%, 60%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#departures)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
