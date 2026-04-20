import { createServerSupabaseClient } from '@/lib/supabase/server';
import { StatsCard } from '@/components/admin/stats-card';
import { CommissionChart } from '@/components/admin/commission-chart';
import { redirect } from 'next/navigation'; // Added for protection
import {
  ShoppingCart,
  Users,
  DollarSign,
  AlertTriangle,
  Shield,
  Package,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const revalidate = 60;

// Update this to include your specific email or admin ID
const ADMIN_EMAIL = 'kaleluthuman45@gmail.com'; 

async function getAdminStats() {
  const supabase = createServerSupabaseClient();

  const [orders, suppliers, products, disputes] = await Promise.all([
    supabase.from('orders').select('id, total, status, platform_commission', { count: 'exact' }),
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'supplier'),
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('disputes').select('id', { count: 'exact', head: true }).eq('status', 'open'),
  ]);

  const totalCommission = (orders.data || []).reduce(
    (sum, o) => sum + (o.platform_commission || 0),
    0
  );
  const pendingEscrow = (orders.data || [])
    .filter((o) => ['confirmed', 'processing', 'shipped'].includes(o.status))
    .reduce((sum, o) => sum + o.total, 0);

  return {
    totalOrders: orders.count || 0,
    totalSuppliers: suppliers.count || 0,
    totalProducts: products.count || 0,
    openDisputes: disputes.count || 0,
    totalCommission,
    pendingEscrow,
  };
}

export default async function AdminDashboard() {
  const supabase = createServerSupabaseClient();

  // --- SECURITY LAYER START ---
  const { data: { user }, error } = await supabase.auth.getUser();

  // If not logged in, or if the email doesn't match yours, kick them out
  if (error || !user || user.email !== ADMIN_EMAIL) {
    redirect('/'); // Redirect to home or login page
  }
  // --- SECURITY LAYER END ---

  const stats = await getAdminStats();

  const chartData = [
    { month: 'Jan', commission: 120000, orders: 15 },
    { month: 'Feb', commission: 250000, orders: 28 },
    { month: 'Mar', commission: 180000, orders: 22 },
    { month: 'Apr', commission: 340000, orders: 35 },
    { month: 'May', commission: 420000, orders: 42 },
    { month: 'Jun', commission: 380000, orders: 38 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Middleman control panel — manage the entire platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <StatsCard
          title="Suppliers"
          value={stats.totalSuppliers.toString()}
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard
          title="Products"
          value={stats.totalProducts.toString()}
          icon={<Package className="h-5 w-5" />}
        />
        <StatsCard
          title="Commission"
          value={formatCurrency(stats.totalCommission, 'UGX')}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatsCard
          title="Escrow Held"
          value={formatCurrency(stats.pendingEscrow, 'UGX')}
          icon={<Shield className="h-5 w-5" />}
          color="text-blue-600"
        />
        <StatsCard
          title="Open Disputes"
          value={stats.openDisputes.toString()}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="text-orange-600"
        />
      </div>

      <CommissionChart data={chartData} />
    </div>
  );
}