import Link from 'next/link';
import { Card, Badge } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ORDER_STATUS_CONFIG } from '@/lib/constants';
import { Package, ArrowRight } from 'lucide-react';
import type { Order } from '@/types/database';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const statusConfig = ORDER_STATUS_CONFIG[order.status];

  return (
    <Link href={`/orders/${order.id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-sm font-medium">{order.order_number}</span>
          </div>
          <Badge className={`${statusConfig.bgColor} ${statusConfig.color}`}>
            {statusConfig.label}
          </Badge>
        </div>

        <div className="space-y-2">
          {order.items.slice(0, 2).map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="truncate max-w-[200px]">{item.title}</span>
              <span className="text-muted-foreground">×{item.quantity}</span>
            </div>
          ))}
          {order.items.length > 2 && (
            <p className="text-xs text-muted-foreground">
              +{order.items.length - 2} more items
            </p>
          )}
        </div>

        <div className="mt-3 pt-3 border-t flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{formatDate(order.created_at)}</span>
          <div className="flex items-center gap-2">
            <span className="font-bold">{formatCurrency(order.total, order.currency)}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
