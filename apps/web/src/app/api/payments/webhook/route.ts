import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { constructStripeEvent } from '@/lib/payments/stripe';
import { verifyPayPalWebhook } from '@/lib/payments/paypal';

export async function POST(request: NextRequest) {
  const supabase = createAdminClient();
  const rawBody = await request.text();
  const headers = Object.fromEntries(request.headers.entries());

  // Determine provider from header or URL
  const provider =
    request.nextUrl.searchParams.get('provider') ||
    (headers['paypal-transmission-id'] ? 'paypal' :
    headers['stripe-signature'] ? 'stripe' : 'flutterwave');

  try {
    // ── Flutterwave webhook ───────────────────────────────────────────────────
    if (provider === 'flutterwave') {
      const sig = headers['verif-hash'];
      const secret = process.env.FLUTTERWAVE_SECRET_HASH;
      if (!sig || sig !== secret) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
      const event = JSON.parse(rawBody);
      if (event.event === 'charge.completed' && event.data?.status === 'successful') {
        await supabase
          .from('orders')
          .update({ status: 'confirmed' })
          .eq('payment_reference', event.data.tx_ref)
          .eq('status', 'pending');
      }
    }

    // ── Stripe webhook ────────────────────────────────────────────────────────
    else if (provider === 'stripe') {
      const sig = headers['stripe-signature'];
      const event = await constructStripeEvent(rawBody, sig);

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata?.order_id || session.client_reference_id;
        if (orderId) {
          await supabase
            .from('orders')
            .update({ status: 'confirmed' })
            .eq('id', orderId);
        }
      }

      if (event.type === 'payment_intent.payment_failed') {
        const pi = event.data.object;
        const orderId = pi.metadata?.order_id;
        if (orderId) {
          await supabase
            .from('orders')
            .update({ status: 'cancelled' })
            .eq('id', orderId);
        }
      }
    }

    // ── PayPal webhook ────────────────────────────────────────────────────────
    else if (provider === 'paypal') {
      const webhookId = process.env.PAYPAL_WEBHOOK_ID!;
      const valid = await verifyPayPalWebhook(webhookId, headers, rawBody);
      if (!valid) {
        return NextResponse.json({ error: 'Invalid PayPal signature' }, { status: 401 });
      }
      const event = JSON.parse(rawBody);
      if (event.event_type === 'CHECKOUT.ORDER.APPROVED' || event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
        const orderId = event.resource?.purchase_units?.[0]?.custom_id
          || event.resource?.supplementary_data?.related_ids?.order_id;
        if (orderId) {
          await supabase
            .from('orders')
            .update({ status: 'confirmed' })
            .eq('id', orderId);
        }
      }
    }

    // ── MTN MoMo / M-Pesa callback ────────────────────────────────────────────
    else if (provider === 'mtn_momo' || provider === 'mpesa') {
      const event = JSON.parse(rawBody);
      // MTN MoMo success callback
      if (event.status === 'SUCCESSFUL' || event.Body?.stkCallback?.ResultCode === 0) {
        const txRef = event.externalId || event.Body?.stkCallback?.CheckoutRequestID;
        if (txRef) {
          await supabase
            .from('orders')
            .update({ status: 'confirmed' })
            .eq('payment_reference', txRef)
            .eq('status', 'pending');
        }
      }
    }

    return NextResponse.json({ status: 'ok' });

  } catch (err) {
    console.error(`Webhook error (${provider}):`, err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
