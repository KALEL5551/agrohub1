import { Check, Clock, Truck, Package, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types';

const steps: { status: OrderStatus; label: string; icon: typeof Check }[] = [
  { status: 'pending', label: 'Order Placed', icon: Clock },
  { status: 'confirmed', label: 'Confirmed', icon: Check },
  { status: 'processing', label: 'Processing', icon: Package },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: Check },
];

const statusOrder: Record<OrderStatus, number> = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  shipped: 3,
  delivered: 4,
  cancelled: -1,
  disputed: -2,
};

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  createdAt: string;
  deliveredAt?: string | null;
}

export function OrderTimeline({ currentStatus, createdAt: _createdAt, deliveredAt: _deliveredAt }: OrderTimelineProps) {
  if (currentStatus === 'cancelled') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 text-red-700">
        <X className="h-5 w-5" />
        <span className="font-medium">Order cancelled</span>
      </div>
    );
  }

  if (currentStatus === 'disputed') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg bg-orange-50 text-orange-700">
        <AlertTriangle className="h-5 w-5" />
        <span className="font-medium">Order under dispute</span>
      </div>
    );
  }

  const currentIndex = statusOrder[currentStatus];

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.status} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors',
                  isCompleted
                    ? 'bg-primary border-primary text-white'
                    : 'border-muted bg-background text-muted-foreground',
                  isCurrent && 'animate-pulse-green'
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className={cn(
                  'text-[10px] mt-1 font-medium text-center',
                  isCompleted ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2',
                  index < currentIndex ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
