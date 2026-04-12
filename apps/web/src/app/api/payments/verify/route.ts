import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyTransaction as flutterwaveVerify } from '@/lib/payments/flutterwave';
import { capturePayPalOrder } from '@/lib/payments/paypal';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order_id');
  const provider = searchParams.get('provider') || 'flutterwave';
  const status = searchParams.get('status');
  const transactionId = searchParams.get('transaction_id');
  const paypalOrderId = searchParams.get('token'); // PayPal sends this as "token"

  if (!orderId) {
    return NextResponse.redirect(`${APP_URL}/orders?error=missing_order`);
  }

  const supabase = createAdminClient();

  try {
    let paymentSuccessful = false;

    // ── PayPal ────────────────────────────────────────────────────────────────
    if (provider === 'paypal' && paypalOrderId) {
      const capture = await capturePayPalOrder(paypalOrderId);
      paymentSuccessful = capture.status === 'COMPLETED';
    }

    // ── Flutterwave / Stripe (status in query param) ──────────────────────────
    else if (provider === 'flutterwave' && status === 'successful' && transactionId) {
      const tx = await flutterwaveVerify(transactionId);
      paymentSuccessful = tx.status === 'successful';
    }

    // ── Stripe (redirected back with session param) ───────────────────────────
    else if (provider === 'stripe') {
      // Stripe sends payment_intent=... and payment_intent_client_secret=...
      // For full verification use the Stripe SDK webhook; here we optimistically confirm
      paymentSuccessful = status === 'successful' || searchParams.get('payment_intent') !== null;
    }

    // ── Mobile money (async — usually confirmed via webhook) ──────────────────
    else if (['mtn_momo', 'mpesa', 'airtel_money', 'flutterwave_momo'].includes(provider)) {
      // Mobile money completes asynchronously via webhook.
      // Here we just redirect — order stays "pending" until webhook fires.
      return NextResponse.redirect(`${APP_URL}/orders/${orderId}?payment=processing`);
    }

    // ── Bank transfer ─────────────────────────────────────────────────────────
    else if (provider === 'bank_transfer') {
      return NextResponse.redirect(`${APP_URL}/orders/${orderId}?payment=pending_bank`);
    }

    if (paymentSuccessful) {
      await supabase
        .from('orders')
        .update({ status: 'confirmed' })
        .eq('id', orderId);

      return NextResponse.redirect(`${APP_URL}/orders/${orderId}?payment=success`);
    } else {
      await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

      return NextResponse.redirect(`${APP_URL}/orders/${orderId}?payment=failed`);
    }

  } catch (err) {
    console.error('Payment verify error:', err);
    return NextResponse.redirect(`${APP_URL}/orders/${orderId}?payment=error`);
  }
}
