/**
 * Agro Hub — Mobile Money Unified Layer
 *
 * Supports:
 *  - MTN Mobile Money   (Uganda, Rwanda, Ghana, Zambia, Cameroon + more)
 *  - Airtel Money       (Uganda, Kenya, Tanzania, Zambia + more)
 *  - M-Pesa             (Kenya, Tanzania, Mozambique, Egypt via Safaricom / Vodacom)
 *
 * For simplicity and reliability, all three are routed through
 * Flutterwave's unified mobile money API — one integration, all three networks.
 *
 * Flutterwave supports:
 *  MTN  → UG, RW, GH, ZM, CM, CI, BJ, GN, SN
 *  Airtel → UG, TZ, ZM, MW, MG, RW, CD, NE, TD
 *  M-Pesa → KE, TZ, MZ, GH, EG, ET
 *  Zamtel → ZM
 *  Mpesa  → KE (Daraja API below as alternative)
 *
 * Env vars:
 *   FLUTTERWAVE_SECRET_KEY
 *   MPESA_CONSUMER_KEY       (optional — only if using Safaricom Daraja directly)
 *   MPESA_CONSUMER_SECRET
 *   MPESA_SHORTCODE
 *   MPESA_PASSKEY
 *   MPESA_CALLBACK_URL
 */

const FLW_BASE = 'https://api.flutterwave.com/v3';

// ─── NETWORK MAP (country → preferred network for mobile money) ────────────────
const NETWORK_MAP: Record<string, string> = {
  'Kenya':     'mpesa',
  'Tanzania':  'mpesa',
  'Uganda':    'MTN',
  'Rwanda':    'MTN',
  'Ghana':     'MTN',
  'Zambia':    'MTN',
  'Cameroon':  'MTN',
  'Mozambique':'mpesa',
  'Nigeria':   'MTN',   // MTN Nigeria
  "Cote d'Ivoire": 'MTN',
  'Senegal':   'ORANGE_MONEY',
  'Mali':      'ORANGE_MONEY',
  'Malawi':    'AIRTEL',
  'Madagascar':'AIRTEL',
  'Chad':      'AIRTEL',
  'Niger':     'AIRTEL',
};

export function getMobileMoneyNetwork(country: string): string {
  return NETWORK_MAP[country] || 'MTN';
}

// ─── FLUTTERWAVE MOBILE MONEY CHARGE ──────────────────────────────────────────
export interface MomoChargeRequest {
  amount: number;
  currency: string;      // e.g. "UGX", "KES", "GHS"
  phone: string;         // E.164 format: +256700000000
  network: string;       // "MTN" | "AIRTEL" | "mpesa" | "ZAMTEL" | "ORANGE_MONEY"
  txRef: string;
  email: string;
  fullName: string;
  redirectUrl: string;
}

export async function initiateMobileMoneyCharge(req: MomoChargeRequest) {
  const endpoint = req.network.toLowerCase() === 'mpesa'
    ? `${FLW_BASE}/charges?type=mpesa`
    : `${FLW_BASE}/charges?type=mobile_money_${getMomoTypeParam(req.currency, req.network)}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone_number: req.phone,
      amount: req.amount,
      currency: req.currency,
      email: req.email,
      fullname: req.fullName,
      tx_ref: req.txRef,
      redirect_url: req.redirectUrl,
      network: req.network,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Mobile money charge failed: ${err}`);
  }

  const data = await res.json();

  if (data.status === 'success' && data.meta?.redirect) {
    return { status: 'redirect', redirectUrl: data.meta.redirect };
  }

  if (data.status === 'success') {
    return { status: 'pending', message: 'Check your phone for a payment prompt.' };
  }

  throw new Error(data.message || 'Mobile money charge failed');
}

function getMomoTypeParam(currency: string, network: string): string {
  const map: Record<string, string> = {
    UGX: 'uganda',
    KES: 'kenya',
    GHS: 'ghana',
    RWF: 'rwanda',
    ZMW: 'zambia',
    TZS: 'tanzania',
    XAF: 'cameroon',
    XOF: 'franco',
  };
  return map[currency] || 'uganda';
}

// ─── SAFARICOM DARAJA (M-Pesa Kenya — direct, optional) ────────────────────
// Use this if you want direct M-Pesa integration instead of Flutterwave for Kenya

async function getMpesaAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const res = await fetch(
    'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${credentials}` } }
  );

  if (!res.ok) throw new Error('M-Pesa auth failed');
  const data = await res.json();
  return data.access_token;
}

export async function initiateMpesaSTKPush(params: {
  phone: string;      // 254XXXXXXXXX
  amount: number;
  accountRef: string;
  description: string;
  callbackUrl: string;
}) {
  const token = await getMpesaAccessToken();
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, '')
    .slice(0, 14);
  const shortcode = process.env.MPESA_SHORTCODE!;
  const passkey = process.env.MPESA_PASSKEY!;
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

  const res = await fetch(
    'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(params.amount),
        PartyA: params.phone,
        PartyB: shortcode,
        PhoneNumber: params.phone,
        CallBackURL: params.callbackUrl,
        AccountReference: params.accountRef,
        TransactionDesc: params.description,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`M-Pesa STK push failed: ${err}`);
  }

  return res.json();
}
