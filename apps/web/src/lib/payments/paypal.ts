/**
 * Agro Hub — PayPal REST API v2
 *
 * Setup:
 *  1. Create a PayPal developer account at developer.paypal.com
 *  2. Create a Sandbox app → get Client ID + Secret
 *  3. Set env vars (see .env.local.example)
 *
 * Env vars required:
 *   PAYPAL_CLIENT_ID
 *   PAYPAL_CLIENT_SECRET
 *   PAYPAL_MODE = "sandbox" | "live"
 *   NEXT_PUBLIC_PAYPAL_CLIENT_ID  (for frontend)
 */

const PAYPAL_BASE =
  process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

// ─── GET ACCESS TOKEN ─────────────────────────────────────────────────────────
async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_CLIENT_SECRET!;

  const credentials = Buffer.from(`${clientId}:${secret}`).toString('base64');

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) throw new Error('Failed to get PayPal access token');
  const data = await res.json();
  return data.access_token;
}

// ─── CREATE ORDER ─────────────────────────────────────────────────────────────
export interface PayPalOrderRequest {
  amount: number;
  currency: string;     // PayPal supports: USD, EUR, GBP, CAD, AUD, JPY, CNY + 20 more
  orderId: string;
  orderNumber: string;
  returnUrl: string;    // success redirect
  cancelUrl: string;    // cancel redirect
  description?: string;
}

export interface PayPalOrderResponse {
  id: string;           // PayPal order ID
  approveLink: string;  // redirect user here to approve
  status: string;
}

// PayPal only supports a subset of currencies — map unsupported ones to USD
const PAYPAL_SUPPORTED_CURRENCIES = new Set([
  'AUD','BRL','CAD','CNY','CZK','DKK','EUR','HKD','HUF','ILS',
  'JPY','MYR','MXN','TWD','NZD','NOK','PHP','PLN','GBP','SGD',
  'SEK','CHF','THB','USD',
]);

function normalisePayPalCurrency(currency: string): string {
  return PAYPAL_SUPPORTED_CURRENCIES.has(currency) ? currency : 'USD';
}

export async function createPayPalOrder(req: PayPalOrderRequest): Promise<PayPalOrderResponse> {
  const token = await getPayPalAccessToken();
  const currency = normalisePayPalCurrency(req.currency);

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: req.orderId,
          description: req.description || `Agro Hub Order ${req.orderNumber}`,
          amount: {
            currency_code: currency,
            value: req.amount.toFixed(2),
          },
          custom_id: req.orderId,
        },
      ],
      application_context: {
        brand_name: 'Agro Hub',
        landing_page: 'LOGIN',
        user_action: 'PAY_NOW',
        return_url: req.returnUrl,
        cancel_url: req.cancelUrl,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal order creation failed: ${err}`);
  }

  const data = await res.json();
  const approveLink = data.links?.find((l: { rel: string; href: string }) => l.rel === 'approve')?.href;

  return {
    id: data.id,
    approveLink: approveLink ?? '',
    status: data.status,
  };
}

// ─── CAPTURE ORDER (after user approves) ─────────────────────────────────────
export async function capturePayPalOrder(paypalOrderId: string) {
  const token = await getPayPalAccessToken();

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal capture failed: ${err}`);
  }

  return res.json();
}

// ─── VERIFY PAYMENT (for webhook) ────────────────────────────────────────────
export async function verifyPayPalWebhook(
  webhookId: string,
  headers: Record<string, string>,
  rawBody: string
): Promise<boolean> {
  const token = await getPayPalAccessToken();

  const res = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      webhook_id: webhookId,
      webhook_event: JSON.parse(rawBody),
      cert_url: headers['paypal-cert-url'],
      auth_algo: headers['paypal-auth-algo'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
    }),
  });

  const data = await res.json();
  return data.verification_status === 'SUCCESS';
}
