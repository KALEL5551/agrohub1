'use client';

import { useOrder } from '@/hooks/use-orders';
import { Card, Badge, Button, Spinner } from '@/components/ui';
import { OrderTimeline } from '@/components/orders/order-timeline';
import { EscrowStatusBadge } from '@/components/orders/escrow-status';
import { TrackingStatus } from '@/components/shipping/tracking-status';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { ORDER_STATUS_CONFIG } from '@/lib/constants';
import { MessageCircle, AlertTriangle } from 'lucide-react';

interface Props {
  params: { id: string };
}

export default function OrderDetailPage({ params }: Props) {
  const { order, isLoading } = useOrder(params.id);

  if (isLoading) return <Spinner className="py-20" />;
  if (!order) return <p>Order not found</p>;

  const statusConfig = ORDER_STATUS_CONFIG[order.status];

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Order {order.order_number}</h1>
          <p className="text-sm text-muted-foreground">Placed on {formatDateTime(order.created_at)}</p>
        </div>
        <Badge className={`${statusConfig.bgColor} ${statusConfig.color} text-sm px-3 py-1`}>
          {statusConfig.label}
        </Badge>
      </div>

      <Card className="p-6">
        <OrderTimeline
          currentStatus={order.status}
          createdAt={order.created_at}
          deliveredAt={order.delivered_at}
        />
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-2">Escrow Status</h3>
          <EscrowStatusBadge status={order.escrow_status} />
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-2">Shipping</h3>
          <TrackingStatus
            trackingNumber={order.shipping_tracking_number}
            carrier={order.shipping_carrier}
          />
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Order Items</h3>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-xl">
                  📦
                </div>
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(item.price, order.currency)} × {item.quantity} {item.unit}
                  </p>
                </div>
              </div>
              <span className="font-semibold text-sm">
                {formatCurrency(item.price * item.quantity, order.currency)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(order.subtotal, order.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>{formatCurrency(order.shipping_cost, order.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platform Fee</span>
            <span>{formatCurrency(order.platform_commission, order.currency)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t">
            <span>Total</span>
            <span>{formatCurrency(order.total, order.currency)}</span>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" type="button">
          <MessageCircle className="mr-2 h-4 w-4" />
          Contact {order.supplier ? 'Supplier' : 'Buyer'}
        </Button>
        {order.status === 'shipped' && <Button type="button">Confirm Delivery</Button>}
        {['pending', 'confirmed', 'processing', 'shipped'].includes(order.status) && (
          <Button variant="destructive" type="button">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Raise Dispute
          </Button>
        )}
      </div>
    </div>
  );
}
