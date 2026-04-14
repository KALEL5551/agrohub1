import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ORDER_STATUS_CONFIG } from '@/lib/constants';
import type { Order } from '@/types/database';

export const revalidate = 30;

export default async function AdminOrdersPage() {
  const supabase = createServerSupabaseClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('*, buyer:users!buyer_id(full_name), supplier:users!supplier_id(full_name, business_name)')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-6">All Orders</h1>
      <p className="text-muted-foreground mb-4">{orders?.length || 0} orders total</p>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold">Order</th>
              <th className="px-4 py-3 text-left font-semibold">Buyer</th>
              <th className="px-4 py-3 text-left font-semibold">Supplier</th>
              <th className="px-4 py-3 text-left font-semibold">Total</th>
              <th className="px-4 py-3 text-left font-semibold">Commission</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Escrow</th>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {(orders || []).map((order: Order & { buyer?: { full_name?: string }; supplier?: { full_name?: string; business_name?: string } }) => {
              const config = ORDER_STATUS_CONFIG[order.status as string];
              return (
                <tr key={order.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{order.order_number}</td>
                  <td className="px-4 py-3">{order.buyer?.full_name}</td>
                  <td className="px-4 py-3">{order.supplier?.business_name || order.supplier?.full_name}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(order.total, order.currency)}</td>
                  <td className="px-4 py-3 text-primary font-medium">
                    {formatCurrency(order.platform_commission, order.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`${config?.bgColor} ${config?.color}`}>{config?.label}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="muted">{order.escrow_status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(order.created_at)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
