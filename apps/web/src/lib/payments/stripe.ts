/**
 * Agro Hub — Stripe Payment Integration
 * Used for card payments outside Africa (Europe, Americas, Asia, Oceania etc.)
 *
 * Env vars required:
 *   STRIPE_SECRET_KEY
 *   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 *   STRIPE_WEBHOOK_SECRET
 */

// We call Stripe REST API directly (no SDK needed, lighter bundle)
const STRIPE_BASE = 'https://api.stripe.com/v1';

function stripeHeaders() {
  return {
    Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
}

function toFormEncoded(obj: Record<string, unknown>, prefix = ''): string {
  return Object.entries(obj)
    .flatMap(([key, value]) => {
      const fullKey = prefix ? `${prefix}[${key}]` : key;
      if (typeof value === 'object' && value !== null) {
        return toFormEncoded(value as Record<string, unknown>, fullKey);
      }
      return `${encodeURIComponent(fullKey)}=${encodeURIComponent(String(value))}`;
    })
    .join('&');
}

// ─── CREATE CHECKOUT SESSION ──────────────────────────────────────────────────
export interface StripeSessionRequest {
  amount: number;          // in smallest currency unit (cents for USD/EUR)
  currency: string;        // lowercase ISO code: "usd", "eur", "gbp" etc.
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  description?: string;
}

export async function createStripeSession(req: StripeSessionRequest) {
  // Stripe uses amounts in smallest unit (cents, pence, etc.)
  // For zero-decimal currencies (JPY, KRW, etc.) use whole number
  const ZERO_DECIMAL = new Set(['jpy','krw','vnd','clp','gnf','pyg','rwf','ugx','xaf','xof']);
  const amountInUnits = ZERO_DECIMAL.has(req.currency.toLowerCase())
    ? Math.round(req.amount)
    : Math.round(req.amount * 100);

  const params = toFormEncoded({
    mode: 'payment',
    'payment_method_types[]': 'card',
    'line_items[0][price_data][currency]': req.currency.toLowerCase(),
    'line_items[0][price_data][product_data][name]': `Agro Hub Order ${req.orderNumber}`,
    'line_items[0][price_data][unit_amount]': amountInUnits,
    'line_items[0][quantity]': 1,
    'customer_email': req.customerEmail,
    'client_reference_id': req.orderId,
    'success_url': req.successUrl,
    'cancel_url': req.cancelUrl,
    'metadata[order_id]': req.orderId,
    'metadata[order_number]': req.orderNumber,
  });

  const res = await fetch(`${STRIPE_BASE}/checkout/sessions`, {
    method: 'POST',
    headers: stripeHeaders(),
    body: params,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Stripe session creation failed: ${err.error?.message}`);
  }

  const session = await res.json();
  return {
    sessionId: session.id,
    paymentLink: session.url,
  };
}

// ─── VERIFY WEBHOOK ───────────────────────────────────────────────────────────
export async function constructStripeEvent(rawBody: string, signature: string) {
  // For proper webhook verification, install `stripe` npm package and use:
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // return stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);

  // Simple manual verification (no SDK):
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  if (!signature || !webhookSecret) throw new Error('Missing Stripe webhook secret');

  // Parse signature header
  const parts = Object.fromEntries(
    signature.split(',').map(part => {
      const [k, v] = part.split('=');
      return [k, v];
    })
  );

  const timestamp = parts['t'];
  const expectedSig = parts['v1'];

  if (!timestamp || !expectedSig) throw new Error('Invalid Stripe signature header');

  // Verify using HMAC (requires crypto module — available in Node.js and Edge)
  const { createHmac } = await import('crypto');
  const payload = `${timestamp}.${rawBody}`;
  const computed = createHmac('sha256', webhookSecret).update(payload).digest('hex');

  if (computed !== expectedSig) {
    throw new Error('Stripe webhook signature mismatch');
  }

  return JSON.parse(rawBody);
}
