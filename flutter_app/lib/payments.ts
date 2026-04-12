// ============================================================
// AgriTrade Africa — Payment Service (Flutterwave)
// apps/web/src/lib/payments.ts
//
// Handles:
//   - MTN MoMo (Uganda)
//   - Airtel Money (Uganda)
//   - Card payments (international)
//   - Payment verification
//   - Escrow hold & release
// ============================================================

import { supabase } from './supabase';
import type { Order, PaymentMethod } from '@agritrade/shared/types';

const FLW_PUBLIC_KEY = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!;
const FLW_BASE_URL = 'https://api.flutterwave.com/v3';

// ─── Types ────────────────────────────────────────────────

interface FlutterwaveConfig {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options: string;
  customer: {
    email: string;
    phone_number: string;
    name: string;
  };
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
  callback: (data: FlutterwaveCallbackData) => void;
  onclose: () => void;
  meta?: Record<string, unknown>;
}

interface FlutterwaveCallbackData {
  status: 'successful' | 'failed' | 'cancelled';
  transaction_id: string;
  tx_ref: string;
  flw_ref: string;
  amount: number;
  currency: string;
  payment_type: string;
}

// ─── Inline Flutterwave SDK loader ────────────────────────

function loadFlutterwaveSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve();
    if ((window as unknown as Record<string, unknown>)['FlutterwaveCheckout']) return resolve();
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Flutterwave SDK'));
    document.head.appendChild(script);
  });
}

// ─── Payment initiator ────────────────────────────────────

export interface InitiatePaymentOptions {
  order: Order;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: PaymentMethod;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

export async function initiatePayment(options: InitiatePaymentOptions): Promise<void> {
  const { order, customerName, customerEmail, customerPhone,
          paymentMethod, onSuccess, onError, onCancel } = options;

  await loadFlutterwaveSDK();

  const paymentOptions = getPaymentOptions(paymentMethod);
  const currency = paymentMethod === 'card' ? 'USD' : 'UGX';
  const amount = currency === 'USD'
    ? order.total_usd
    : (order.total_ugx ?? order.total_usd * 3750);

  const config: FlutterwaveConfig = {
    public_key: FLW_PUBLIC_KEY,
    tx_ref: `AT-${order.order_number}-${Date.now()}`,
    amount,
    currency,
    payment_options: paymentOptions,
    customer: {
      email: customerEmail,
      phone_number: customerPhone.startsWith('+') ? customerPhone : `+256${customerPhone}`,
      name: customerName,
    },
    customizations: {
      title: 'AgriTrade Africa',
      description: `Order ${order.order_number}`,
      logo: 'https://agritrade.africa/logo.png',
    },
    meta: {
      order_id: order.id,
      order_number: order.order_number,
    },
    callback: async (data) => {
      if (data.status === 'successful') {
        // Verify on server side before confirming
        try {
          await verifyAndRecordPayment(order.id, data.transaction_id, data.tx_ref);
          onSuccess(data.transaction_id);
        } catch (err) {
          onError(err instanceof Error ? err.message : 'Payment verification failed');
        }
      } else {
        onError(`Payment ${data.status}`);
      }
    },
    onclose: () => onCancel(),
  };

  const FlutterwaveCheckout = (window as unknown as Record<string, unknown>)['FlutterwaveCheckout'] as
    (config: FlutterwaveConfig) => void;
  FlutterwaveCheckout(config);
}

function getPaymentOptions(method: PaymentMethod): string {
  switch (method) {
    case 'mtn_momo':       return 'mobilemoneyrwanda,mobilemoneyuganda';
    case 'airtel_money':   return 'mobilemoneyuganda';
    case 'card':           return 'card';
    case 'bank_transfer':  return 'banktransfer';
    case 'ussd':           return 'ussd';
    default:               return 'card,mobilemoneyuganda';
  }
}

// ─── Payment verification (calls Edge Function) ───────────

async function verifyAndRecordPayment(
  orderId: string,
  transactionId: string,
  txRef: string
): Promise<void> {
  const { error } = await supabase.functions.invoke('verify-payment', {
    body: { order_id: orderId, transaction_id: transactionId, tx_ref: txRef },
  });
  if (error) throw new Error(error.message);
}

// ─── USSD payment (for feature phones / offline) ──────────

export async function initiateUSSDPayment(
  phone: string,
  amountUGX: number,
  orderId: string
): Promise<{ ussd_code: string; reference: string }> {
  const { data, error } = await supabase.functions.invoke('initiate-ussd-payment', {
    body: { phone, amount_ugx: amountUGX, order_id: orderId },
  });
  if (error) throw error;
  return data;
}

// ─── Payment status polling ───────────────────────────────

export async function pollPaymentStatus(
  orderId: string,
  timeoutMs = 300000,     // 5 min timeout
  intervalMs = 3000
): Promise<'paid' | 'failed' | 'timeout'> {
  const start = Date.now();

  return new Promise((resolve) => {
    const timer = setInterval(async () => {
      if (Date.now() - start > timeoutMs) {
        clearInterval(timer);
        resolve('timeout');
        return;
      }

      const { data } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();

      if (data?.status === 'payment_held') {
        clearInterval(timer);
        resolve('paid');
      } else if (data?.status === 'cancelled') {
        clearInterval(timer);
        resolve('failed');
      }
    }, intervalMs);
  });
}

// ─── Escrow management helpers ────────────────────────────

export async function releaseEscrow(orderId: string): Promise<void> {
  const { error } = await supabase.functions.invoke('release-escrow', {
    body: { order_id: orderId },
  });
  if (error) throw new Error(error.message);
}

export async function raiseDispute(orderId: string, reason: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({
      status: 'disputed',
      disputed_at: new Date().toISOString(),
      dispute_reason: reason,
    })
    .eq('id', orderId);
  if (error) throw error;
}

// ─── Currency utilities ───────────────────────────────────

export async function getExchangeRate(): Promise<number> {
  const { data } = await supabase
    .from('platform_config')
    .select('value')
    .eq('key', 'usd_to_ugx_rate')
    .single();
  return Number(data?.value ?? 3750);
}

export function formatUGX(amount: number): string {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
