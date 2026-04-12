import type { ReactNode } from 'react';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  icon: ReactNode;
  color?: string;
}

export function StatsCard({ title, value, change, icon, color = 'text-primary' }: StatsCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change !== undefined && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs mt-1',
                change >= 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              {change >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(change)}% vs last month
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-lg bg-primary/10', color)}>{icon}</div>
      </div>
    </Card>
  );
}
