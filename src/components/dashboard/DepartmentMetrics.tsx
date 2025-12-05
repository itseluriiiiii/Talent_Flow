import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { analyticsData } from '@/data/mockData';

export function DepartmentMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Department Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analyticsData.departmentMetrics.map((dept) => (
            <div key={dept.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{dept.name}</span>
                <span className="text-sm text-muted-foreground">
                  {dept.headcount} employees
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Progress 
                  value={(dept.avgPerformance / 5) * 100} 
                  className="h-2 flex-1"
                />
                <span className="text-sm font-medium w-8">
                  {dept.avgPerformance.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{dept.openPositions} open positions</span>
                <span>{dept.turnoverRate}% turnover</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
