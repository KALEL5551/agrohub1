'use client';
// ============================================================
// AgriTrade Africa — Admin Dashboard
// apps/web/src/app/admin/page.tsx
//
// YOUR control panel as the middleman:
//   - Verify/reject supplier applications
//   - Approve/reject product listings
//   - Manage disputed orders
//   - Commission overview
//   - Release escrow
// ============================================================

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { formatUSD } from '../../lib/payments';
import type { Profile, Product, Order, SupplierProfile } from '@agritrade/shared/types';

// ─── Admin guard ──────────────────────────────────────────

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'suppliers' | 'listings' | 'orders' | 'disputes'
  >('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">AT</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">AgriTrade Admin</h1>
              <p className="text-xs text-gray-500">Middleman Control Panel</p>
            </div>
          </div>
          <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">
            Admin · Full Access
          </span>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="bg-white border-b border-gray-100 px-6">
        <div className="max-w-7xl mx-auto flex gap-0">
          {(['overview', 'suppliers', 'listings', 'orders', 'disputes'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors
                ${activeTab === tab
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'overview'  && <OverviewTab />}
        {activeTab === 'suppliers' && <SuppliersTab />}
        {activeTab === 'listings'  && <ListingsTab />}
        {activeTab === 'orders'    && <OrdersTab />}
        {activeTab === 'disputes'  && <DisputesTab />}
      </div>
    </div>
  );
}

// ─── Overview tab ─────────────────────────────────────────

function OverviewTab() {
  const [stats, setStats] = useState({
    total_orders: 0,
    total_revenue_usd: 0,
    total_commission_usd: 0,
    pending_verification: 0,
    pending_listings: 0,
    active_disputes: 0,
    escrow_held_usd: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const [orders, pendingSuppliers, pendingListings, disputes, escrow] = await Promise.all([
        supabase.from('orders').select('total_usd, platform_fee_usd, markup_usd').not('status', 'eq', 'cancelled'),
        supabase.from('supplier_profiles').select('id', { count: 'exact' }).eq('is_verified', false),
        supabase.from('products').select('id', { count: 'exact' }).eq('status', 'pending_review'),
        supabase.from('orders').select('id', { count: 'exact' }).eq('status', 'disputed'),
        supabase.from('orders').select('total_usd').eq('escrow_released', false).eq('status', 'payment_held'),
      ]);

      const orderRows = orders.data ?? [];
      setStats({
        total_orders: orderRows.length,
        total_revenue_usd: orderRows.reduce((s, o) => s + o.total_usd, 0),
        total_commission_usd: orderRows.reduce((s, o) => s + o.platform_fee_usd + o.markup_usd, 0),
        pending_verification: pendingSuppliers.count ?? 0,
        pending_listings: pendingListings.count ?? 0,
        active_disputes: disputes.count ?? 0,
        escrow_held_usd: (escrow.data ?? []).reduce((s, o) => s + o.total_usd, 0),
      });
    }
    loadStats();
  }, []);

  const statCards = [
    { label: 'Total orders', value: stats.total_orders.toLocaleString(), color: 'blue' },
    { label: 'Total GMV', value: formatUSD(stats.total_revenue_usd), color: 'green' },
    { label: 'Your earnings', value: formatUSD(stats.total_commission_usd), color: 'emerald' },
    { label: 'Escrow held', value: formatUSD(stats.escrow_held_usd), color: 'amber' },
    { label: 'Pending suppliers', value: stats.pending_verification, color: 'orange', urgent: stats.pending_verification > 0 },
    { label: 'Pending listings', value: stats.pending_listings, color: 'purple', urgent: stats.pending_listings > 0 },
    { label: 'Active disputes', value: stats.active_disputes, color: 'red', urgent: stats.active_disputes > 0 },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Platform overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map(card => (
          <div
            key={card.label}
            className={`bg-white rounded-xl p-4 border ${card.urgent ? 'border-red-200' : 'border-gray-100'}`}
          >
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className={`text-xl font-bold ${card.urgent ? 'text-red-600' : 'text-gray-900'}`}>
              {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
            </p>
            {card.urgent && (
              <span className="text-xs text-red-500 font-medium">Needs attention</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Suppliers tab ────────────────────────────────────────

function SuppliersTab() {
  const [suppliers, setSuppliers] = useState<(SupplierProfile & { profile: Profile })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('supplier_profiles')
      .select('*, profile:profiles(*)')
      .eq('is_verified', false)
      .order('created_at', { ascending: true })
      .then(({ data }) => { setSuppliers(data ?? []); setLoading(false); });
  }, []);

  async function verify(supplierId: string, approve: boolean) {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    await supabase
      .from('supplier_profiles')
      .update({
        is_verified: approve,
        verified_at: approve ? new Date().toISOString() : null,
        verified_by: approve ? userId : null,
      })
      .eq('id', supplierId);
    setSuppliers(s => s.filter(x => x.id !== supplierId));
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Supplier verification queue
        {suppliers.length > 0 && (
          <span className="ml-2 text-sm font-normal text-gray-500">({suppliers.length} pending)</span>
        )}
      </h2>

      {suppliers.length === 0 ? (
        <EmptyState message="No pending supplier applications." />
      ) : (
        <div className="space-y-3">
          {suppliers.map(supplier => (
            <div key={supplier.id} className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{supplier.company_name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
                      {supplier.company_country}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{supplier.company_description}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>Contact: {supplier.profile?.full_name}</span>
                    <span>Email: {supplier.profile?.email}</span>
                    <span>Applied: {new Date(supplier.created_at).toLocaleDateString()}</span>
                  </div>
                  {supplier.categories && (
                    <div className="flex gap-1 mt-2">
                      {supplier.categories.map(cat => (
                        <span key={cat} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => verify(supplier.id, false)}
                    className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => verify(supplier.id, true)}
                    className="px-3 py-1.5 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    ✓ Verify
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Listings tab ─────────────────────────────────────────

function ListingsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('*, supplier:supplier_profiles(company_name, company_country, is_verified)')
      .eq('status', 'pending_review')
      .order('created_at', { ascending: true })
      .then(({ data }) => { setProducts(data ?? []); setLoading(false); });
  }, []);

  async function reviewProduct(productId: string, approve: boolean) {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    await supabase
      .from('products')
      .update({
        status: approve ? 'active' : 'suspended',
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', productId);
    setProducts(p => p.filter(x => x.id !== productId));
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Product listing review
        {products.length > 0 && (
          <span className="ml-2 text-sm font-normal text-gray-500">({products.length} pending)</span>
        )}
      </h2>

      {products.length === 0 ? (
        <EmptyState message="No listings pending review." />
      ) : (
        <div className="space-y-3">
          {products.map(product => (
            <div key={product.id} className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="flex gap-4">
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0 bg-gray-100"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{product.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {product.supplier && (typeof product.supplier === 'object') &&
                          'company_name' in product.supplier
                          ? (product.supplier as SupplierProfile).company_name
                          : 'Unknown supplier'
                        } · {product.origin_country} ·
                        <span className={`ml-1 capitalize font-medium
                          ${product.category === 'agriculture' ? 'text-green-600' : 'text-amber-600'}`}>
                          {product.category}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{product.description}</p>
                      <p className="text-base font-bold text-gray-900 mt-1">{formatUSD(product.price_usd)}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => reviewProduct(product.id, false)}
                        className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => reviewProduct(product.id, true)}
                        className="px-3 py-1.5 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        ✓ Approve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Orders tab ───────────────────────────────────────────

function OrdersTab() {
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('orders')
      .select('*, buyer:profiles!buyer_id(full_name), supplier:profiles!supplier_id(full_name)')
      .not('status', 'in', '("cancelled","refunded")')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => { setOrderList(data ?? []); setLoading(false); });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Active orders</h2>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Order #', 'Buyer', 'Supplier', 'Total', 'Status', 'Escrow', 'Date'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orderList.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-green-700 font-semibold">
                  {order.order_number}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {(order.buyer as Profile)?.full_name ?? '—'}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {(order.supplier as Profile)?.full_name ?? '—'}
                </td>
                <td className="px-4 py-3 font-semibold">{formatUSD(order.total_usd)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize
                    ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'disputed' ? 'bg-red-100 text-red-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'}`}
                  >
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${order.escrow_released ? 'text-gray-400' : 'text-amber-600'}`}>
                    {order.escrow_released ? 'Released' : 'Held'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(order.created_at).toLocaleDateString('en-UG', { month: 'short', day: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Disputes tab ─────────────────────────────────────────

function DisputesTab() {
  const [disputes, setDisputes] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('orders')
      .select('*, buyer:profiles!buyer_id(full_name, phone), supplier:profiles!supplier_id(full_name)')
      .eq('status', 'disputed')
      .order('disputed_at', { ascending: true })
      .then(({ data }) => { setDisputes(data ?? []); setLoading(false); });
  }, []);

  async function resolveDispute(orderId: string, resolution: string, refund: boolean) {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    await supabase.from('orders').update({
      status: refund ? 'refunded' : 'delivered',
      dispute_resolved_at: new Date().toISOString(),
      dispute_resolved_by: userId,
      dispute_resolution: resolution,
      escrow_released: !refund,
    }).eq('id', orderId);
    setDisputes(d => d.filter(x => x.id !== orderId));
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Dispute resolution
        {disputes.length > 0 && (
          <span className="ml-2 text-sm text-red-500 font-normal">({disputes.length} active)</span>
        )}
      </h2>

      {disputes.length === 0 ? (
        <EmptyState message="No active disputes. Great news!" />
      ) : (
        <div className="space-y-4">
          {disputes.map(order => (
            <DisputeCard
              key={order.id}
              order={order}
              onResolve={resolveDispute}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DisputeCard({ order, onResolve }: {
  order: Order;
  onResolve: (id: string, resolution: string, refund: boolean) => void;
}) {
  const [resolution, setResolution] = useState('');

  return (
    <div className="bg-white border border-red-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="font-mono text-sm font-bold text-red-700">{order.order_number}</span>
          <span className="mx-2 text-gray-300">·</span>
          <span className="text-sm text-gray-600">{formatUSD(order.total_usd)}</span>
        </div>
        <span className="text-xs text-gray-400">
          Disputed {order.disputed_at ? new Date(order.disputed_at).toLocaleDateString() : ''}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Buyer</p>
          <p className="font-medium">{(order.buyer as Profile)?.full_name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Supplier</p>
          <p className="font-medium">{(order.supplier as Profile)?.full_name}</p>
        </div>
      </div>

      <div className="bg-red-50 rounded-lg p-3 mb-3 text-sm">
        <p className="text-xs font-semibold text-red-700 mb-1">Dispute reason</p>
        <p className="text-red-800">{order.dispute_reason}</p>
      </div>

      <textarea
        value={resolution}
        onChange={e => setResolution(e.target.value)}
        placeholder="Resolution note (will be shared with both parties)..."
        rows={2}
        className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none mb-2"
      />

      <div className="flex gap-2">
        <button
          onClick={() => onResolve(order.id, resolution, true)}
          disabled={!resolution.trim()}
          className="flex-1 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50"
        >
          Refund buyer
        </button>
        <button
          onClick={() => onResolve(order.id, resolution, false)}
          disabled={!resolution.trim()}
          className="flex-1 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          Release to supplier
        </button>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 py-12 text-center">
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}
