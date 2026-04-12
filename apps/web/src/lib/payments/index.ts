/**
 * Agro Hub — Unified Payment Gateway Router
 *
 * Chooses the right payment provider based on:
 *   - Payment method selected by user (card / paypal / mobilemoney / bank / crypto)
 *   - User's country / currency
 *
 * Providers:
 *   card        → Flutterwave (Africa) OR Stripe (rest of world)
 *   paypal      → PayPal REST API
 *   mobilemoney → MTN MoMo / Airtel Money / M-Pesa (via Africa's Talking or Flutterwave)
 *   bank_transfer → Manual SWIFT reference (no API needed)
 *   crypto      → Binance Pay or CoinGate
 */

export type PaymentMethod =
  | 'card'
  | 'paypal'
  | 'mobilemoney'
  | 'bank_transfer'
  | 'crypto';

export interface PaymentInitRequest {
  orderId: string;
  amount: number;          // in userCurrency
  currency: string;        // user's display currency
  method: PaymentMethod;
  customer: {
    email: string;
    name: string;
    phone?: string;
    country?: string;
  };
  redirectUrl: string;     // where to send user after payment
  orderNumber: string;
}

export interface PaymentInitResult {
  provider: string;
  paymentLink?: string;    // redirect user here
  reference: string;       // internal tx ref
  instructions?: string;   // for bank_transfer — show to user
  qrCode?: string;         // for crypto
}

// ─── AFRICAN MOBILE MONEY COUNTRIES ──────────────────────────────────────────
const MTN_MOMO_COUNTRIES = new Set([
  'Uganda','Rwanda','Zambia','Ghana','Cameroon',
  'Congo (DRC)','Ivory Coast','Benin','Guinea-Conakry',
]);
const AIRTEL_COUNTRIES = new Set([
  'Uganda','Kenya','Tanzania','Zambia','Malawi',
  'Madagascar','Rwanda','Congo (DRC)','Niger','Chad',
]);
const MPESA_COUNTRIES = new Set(['Kenya', 'Tanzania', 'Mozambique', 'Ghana', 'Egypt', 'Ethiopia']);

// ─── FLUTTERWAVE COUNTRIES (Africa + some global) ────────────────────────────
const FLUTTERWAVE_COUNTRIES = new Set([
  'Nigeria','Ghana','Kenya','Uganda','Tanzania','Rwanda','Zambia','Zimbabwe',
  'Malawi','Mozambique','South Africa','Egypt','Cameroon','Ethiopia','Senegal',
  "Cote d'Ivoire",'Burkina Faso','Mali','Niger','Togo','Benin','Guinea',
  'Congo (DRC)','Angola','Madagascar','Sierra Leone','Sudan','South Sudan',
  'Morocco','Tunisia','Algeria','Libya','Somalia',
]);

export function getPaymentProvider(country: string, method: PaymentMethod): string {
  if (method === 'paypal') return 'paypal';
  if (method === 'crypto') return 'binance_pay';
  if (method === 'bank_transfer') return 'manual_swift';

  if (method === 'mobilemoney') {
    if (MPESA_COUNTRIES.has(country)) return 'mpesa';
    if (MTN_MOMO_COUNTRIES.has(country)) return 'mtn_momo';
    if (AIRTEL_COUNTRIES.has(country)) return 'airtel_money';
    // Default to Flutterwave mobile money for other African countries
    if (FLUTTERWAVE_COUNTRIES.has(country)) return 'flutterwave_momo';
    return 'flutterwave_momo';
  }

  if (method === 'card') {
    // Use Flutterwave for Africa (better coverage + local currencies)
    if (FLUTTERWAVE_COUNTRIES.has(country)) return 'flutterwave';
    // Use Stripe for the rest of the world
    return 'stripe';
  }

  return 'stripe';
}
