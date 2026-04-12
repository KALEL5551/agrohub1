'use client';
// ============================================================
// AgriTrade Africa — OrderTracking Component
// apps/web/src/components/dashboard/OrderTracking.tsx
//
// Shows:
//   - Order status timeline
//   - Logistics stages (like Alibaba/DHL tracking)
//   - Escrow status with release action
//   - Dispute button
// ============================================================

import { useEffect, useState } from 'react';
import { formatUSD, formatUGX, releaseEscrow, raiseDispute } from '../../lib/payments';
import { orders as ordersApi } from '../../lib/supabase';
import type { Order, LogisticsStage } from '@agritrade/shared/types';

const ORDER_STEPS: Array<{ status: Order['status']; label: string; icon: string }> = [
  { status: 'pending_payment',    label: 'Order placed',       icon: '📋' },
  { status: 'payment_held',       label: 'Payment secured',    icon: '🔒' },
  { status: 'processing',         label: 'Being prepared',     icon: '📦' },
  { status: 'shipped',            label: 'Shipped',            icon: '✈️' },
  { status: 'in_customs',         label: 'Clearing customs',   icon: '🏛️' },
  { status: 'out_for_delivery',   label: 'Out for delivery',   icon: '🚚' },
  { status: 'delivered',          label: 'Delivered',          icon: '✅' },
];

const STATUS_ORDER = ORDER_STEPS.map(s => s.status);

interface OrderTrackingProps {
  orderId: string;
  currentUserId: string;
}

export function OrderTracking({ orderId, currentUserId }: OrderTrackingProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [releasing, setReleasing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  // Load order
  useEffect(() => {
    ordersApi.getById(orderId)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [orderId]);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = ordersApi.subscribeToOrder(orderId, (updated) => {
      setOrder(updated);
    });
    return () => { channel.unsubscribe(); };
  }, [orderId]);

  async function handleConfirmDelivery() {
    if (!order) return;
    setConfirming(true);
    try {
      await ordersApi.confirmDelivery(orderId);
    } finally {
      setConfirming(false);
    }
  }

  async function handleReleaseEscrow() {
    if (!order) return;
    setReleasing(true);
    try {
      await releaseEscrow(orderId);
    } finally {
      setReleasing(false);
    }
  }

  async function handleDispute() {
    if (!order || !disputeReason.trim()) return;
    await raiseDispute(orderId, disputeReason);
    setDisputeOpen(false);
  }

  if (loading) return <OrderTrackingSkeleton />;
  if (!order) return <div className="text-sm text-gray-500 p-6">Order not found.</div>;

  const currentStepIndex = STATUS_ORDER.indexOf(order.status);
  const isBuyer = order.buyer_id === currentUserId;
  const canConfirmDelivery = isBuyer && order.status === 'out_for_delivery';
  const canReleaseEscrow = !order.escrow_released && order.status === 'delivered';
  const canDispute = isBuyer && ['payment_held', 'processing', 'shipped', 'in_customs', 'out_for_delivery'].includes(order.status);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Order header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-xs text-gray-500">Order</span>
            <h2 className="text-base font-bold text-gray-900">#{order.order_number}</h2>
          </div>
          <StatusPill status={order.status} />
        </div>
        <div className="flex gap-6 mt-3 text-sm">
          <div>
            <span className="text-gray-400">Total</span>
            <p className="font-semibold text-gray-900">{formatUSD(order.total_usd)}</p>
            <p className="text-xs text-gray-400">{formatUGX(order.total_ugx ?? order.total_usd * 3750)}</p>
          </div>
          <div>
            <span className="text-gray-400">Escrow</span>
            <p className={`font-semibold ${order.escrow_released ? 'text-green-600' : 'text-amber-600'}`}>
              {order.escrow_released ? 'Released' : 'Held'}
            </p>
          </div>
          {order.estimated_delivery && (
            <div>
              <span className="text-gray-400">Est. delivery</span>
              <p className="font-semibold text-gray-900">
                {new Date(order.estimated_delivery).toLocaleDateString('en-UG', {
                  month: 'short', day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Status timeline */}
      <div className="px-6 py-5">
        <div className="relative">
          {/* Progress line */}
          <div className="absolute left-[18px] top-[18px] bottom-4 w-0.5 bg-gray-100" />
          <div
            className="absolute left-[18px] top-[18px] w-0.5 bg-green-500 transition-all duration-500"
            style={{
              height: `${Math.max(0, currentStepIndex) * (100 / (ORDER_STEPS.length - 1))}%`
            }}
          />

          <div className="space-y-4">
            {ORDER_STEPS.map((step, idx) => {
              const done = idx <= currentStepIndex;
              const active = idx === currentStepIndex;
              return (
                <div key={step.status} className="flex items-start gap-3 relative z-10">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-all
                    ${active
                      ? 'bg-green-600 ring-4 ring-green-100'
                      : done
                        ? 'bg-green-500'
                        : 'bg-white border-2 border-gray-200'
                    }`}
                  >
                    {done ? (
                      <span className="text-base">{step.icon}</span>
                    ) : (
                      <span className="text-xs text-gray-300">{idx + 1}</span>
                    )}
                  </div>
                  <div className="pt-1.5">
                    <p className={`text-sm font-medium ${done ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {active && order.logistics_stages && (
                      <LogisticsDetail stages={order.logistics_stages} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tracking number */}
      {order.tracking_number && (
        <div className="mx-6 mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-500 font-medium">Tracking number</p>
              <p className="text-sm font-mono font-semibold text-blue-900">{order.tracking_number}</p>
              <p className="text-xs text-blue-400">{order.shipping_carrier}</p>
            </div>
            {order.tracking_url && (
              <a
                href={order.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                Track on {order.shipping_carrier} →
              </a>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-6 pb-5 flex flex-wrap gap-2">
        {canConfirmDelivery && (
          <button
            onClick={handleConfirmDelivery}
            disabled={confirming}
            className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {confirming ? 'Confirming...' : '✓ I received this order'}
          </button>
        )}

        {canReleaseEscrow && (
          <button
            onClick={handleReleaseEscrow}
            disabled={releasing}
            className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 disabled:opacity-50 transition-colors"
          >
            {releasing ? 'Processing...' : '🔓 Release payment to supplier'}
          </button>
        )}

        {canDispute && !disputeOpen && (
          <button
            onClick={() => setDisputeOpen(true)}
            className="py-2.5 px-4 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
          >
            Raise dispute
          </button>
        )}
      </div>

      {/* Dispute form */}
      {disputeOpen && (
        <div className="mx-6 mb-5 p-4 bg-red-50 rounded-xl border border-red-200">
          <p className="text-sm font-semibold text-red-800 mb-2">Raise a dispute</p>
          <p className="text-xs text-red-600 mb-3">
            The AgriTrade team will review your case within 24 hours. Your payment remains held until resolution.
          </p>
          <textarea
            value={disputeReason}
            onChange={e => setDisputeReason(e.target.value)}
            placeholder="Describe the issue (e.g. goods not received, wrong items, quality issues)..."
            rows={3}
            className="w-full text-sm px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-white resize-none"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleDispute}
              disabled={!disputeReason.trim()}
              className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              Submit dispute
            </button>
            <button
              onClick={() => setDisputeOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Escrow explanation */}
      {!order.escrow_released && (
        <div className="mx-6 mb-5 px-4 py-3 bg-amber-50 rounded-xl border border-amber-100">
          <p className="text-xs text-amber-700">
            <strong>Escrow active</strong> — Your payment is securely held by AgriTrade.
            It will be released to the supplier only when you confirm receipt of your goods.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Logistics detail ─────────────────────────────────────

function LogisticsDetail({ stages }: { stages: LogisticsStage[] }) {
  const recent = stages.filter(s => s.completed).slice(-3).reverse();
  if (!recent.length) return null;

  return (
    <div className="mt-1 space-y-0.5">
      {recent.map((stage, i) => (
        <div key={i} className="text-xs text-gray-500">
          <span className="font-medium text-gray-600">{stage.location}</span>
          {stage.note && <span> — {stage.note}</span>}
          <span className="ml-1 text-gray-400">
            {new Date(stage.timestamp).toLocaleDateString('en-UG', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Status pill ──────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  pending_payment:   'bg-gray-100 text-gray-700',
  payment_held:      'bg-amber-100 text-amber-800',
  processing:        'bg-blue-100 text-blue-700',
  shipped:           'bg-purple-100 text-purple-700',
  in_customs:        'bg-orange-100 text-orange-700',
  out_for_delivery:  'bg-cyan-100 text-cyan-700',
  delivered:         'bg-green-100 text-green-800',
  disputed:          'bg-red-100 text-red-700',
  refunded:          'bg-slate-100 text-slate-700',
  cancelled:         'bg-gray-100 text-gray-500',
};

const STATUS_LABELS: Record<string, string> = {
  pending_payment:   'Awaiting payment',
  payment_held:      'Payment secured',
  processing:        'Processing',
  shipped:           'Shipped',
  in_customs:        'In customs',
  out_for_delivery:  'Out for delivery',
  delivered:         'Delivered',
  disputed:          'Disputed',
  refunded:          'Refunded',
  cancelled:         'Cancelled',
};

function StatusPill({ status }: { status: Order['status'] }) {
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────

function OrderTrackingSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="h-5 bg-gray-100 rounded w-32" />
        <div className="flex gap-6 mt-3">
          {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded w-20" />)}
        </div>
      </div>
      <div className="px-6 py-5 space-y-4">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100" />
            <div className="pt-1.5 flex-1">
              <div className="h-3.5 bg-gray-100 rounded w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
