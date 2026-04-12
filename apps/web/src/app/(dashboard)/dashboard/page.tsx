'use client';

import Link from 'next/link';
import {
  ShoppingCart, Package, MessageCircle,
  DollarSign, ArrowRight, Plus, Leaf,
} from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { StatsCard } from '@/components/admin/stats-card';
import { OrderCard } from '@/components/orders/order-card';
import { useAuth } from '@/hooks/use-auth';
import { useOrders } from '@/hooks/use-orders';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const { orders, isLoading } = useOrders();

  const recentOrders = orders.slice(0, 5);
  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold">
          Welcome back, {user?.full_name?.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your{' '}
          {user?.role === 'supplier' ? 'farm / business listings' : 'orders'} today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Orders"
          value={orders.length.toString()}
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <StatsCard
          title="Pending"
          value={pendingOrders.toString()}
          icon={<Package className="h-5 w-5" />}
          color="text-yellow-600"
        />
        <StatsCard
          title={user?.role === 'supplier' ? 'Revenue' : 'Total Spent'}
          value={formatCurrency(totalRevenue, 'USD')}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatsCard title="Messages" value="—" icon={<MessageCircle className="h-5 w-5" />} />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        {user?.role === 'supplier' && (
          <Link href="/listings/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Listing
            </Button>
          </Link>
        )}
        <Link href="/products">
          <Button variant="outline">
            <Leaf className="mr-2 h-4 w-4" /> Browse Marketplace
          </Button>
        </Link>
        <Link href="/chat">
          <Button variant="outline">
            <MessageCircle className="mr-2 h-4 w-4" /> Messages
          </Button>
        </Link>
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Recent Orders</h2>
          <Link href="/orders">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="font-semibold">No orders yet</p>
            <p className="text-sm text-muted-foreground">Start by browsing the agro marketplace</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
