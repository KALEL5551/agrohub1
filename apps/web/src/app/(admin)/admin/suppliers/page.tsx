import { createServerSupabaseClient } from '@/lib/supabase/server';

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
      <p className="text-muted-foreground mb-4">
        {suppliers?.length || 0} suppliers registered
      </p>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Country</th>
              <th className="px-4 py-3 text-left font-semibold">KYC</th>
              <th className="px-4 py-3 text-left font-semibold">Verified</th>
            </tr>
          </thead>
          <tbody>
            {(suppliers || []).map((s) => (
              <tr key={s.id} className="border-b hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{s.business_name || s.full_name}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.email}</td>
                <td className="px-4 py-3">{s.country}</td>
                <td className="px-4 py-3">{s.kyc_status}</td>
                <td className="px-4 py-3">{s.is_verified ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
