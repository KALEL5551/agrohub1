import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AdminSuppliersClient } from '@/components/admin/admin-suppliers-client';
import type { User } from '@/types/database';

export const revalidate = 30;

export default async function AdminSuppliersPage() {
  const supabase = createServerSupabaseClient();
  const { data: suppliers } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'supplier')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-6">Supplier Management</h1>
      <AdminSuppliersClient suppliers={(suppliers as User[]) || []} />
    </div>
  );
}
