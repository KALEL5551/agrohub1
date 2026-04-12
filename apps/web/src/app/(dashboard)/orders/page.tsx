'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/use-orders';
import { OrderCard } from '@/components/orders/order-card';
import { Spinner, Button } from '@/components/ui';
import type { OrderStatus } from '@/types';

const STATUS_TABS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'disputed', label: 'Disputed' },
];

export default function OrdersPage() {
  const { orders, isLoading } = useOrders();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const filteredOrders =
    statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-6">My Orders</h1>

      <div className="flex gap-1 overflow-x-auto mb-6 pb-2">
        {STATUS_TABS.map((tab) => (
          <Button
            key={tab.value}
            variant={statusFilter === tab.value ? 'default' : 'ghost'}
            size="sm"
            type="button"
            onClick={() => setStatusFilter(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <Spinner className="py-20" />
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-4xl mb-3">📦</p>
          <p>No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
