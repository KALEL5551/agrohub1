import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { initializePayment, generateTxRef } from '@/lib/payments/flutterwave';
import { generateOrderNumber, calculateCommission } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, shipping_address, payment_method } = body;

    const productIds = items.map((item: { product_id: string }) => item.product_id);
    const { data: products } = await supabase.from('products').select('*').in('id', productIds);

    if (!products || products.length === 0) {
      return NextResponse.json({ success: false, error: 'Products not found' }, { status: 400 });
    }

    const orderItems = items.map((item: { product_id: string; quantity: number }) => {
      const product = products.find((p: { id: string }) => p.id === item.product_id);
      if (!product) throw new Error('Product mismatch');
      return {
        product_id: product.id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        unit: product.unit,
        image: product.images?.[0] || '',
      };
    });

    const subtotal = orderItems.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    );
    const commission = calculateCommission(subtotal);
    const shippingCost = 0;
    const total = subtotal + commission + shippingCost;

    const supplierId = products[0].supplier_id;
    const currency = products[0].currency;
    const orderNumber = generateOrderNumber();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        buyer_id: user.id,
        supplier_id: supplierId,
        status: 'pending',
        items: orderItems,
        subtotal,
        shipping_cost: shippingCost,
        platform_commission: commission,
        total,
        currency,
        escrow_status: 'held',
        shipping_address,
        payment_method,
      })
      .select('id')
      .single();

    if (orderError) throw orderError;

    const txRef = generateTxRef(order.id);

    const { data: userProfile } = await supabase
      .from('users')
      .select('email, full_name, phone')
      .eq('id', user.id)
      .single();

    const payment = await initializePayment({
      tx_ref: txRef,
      amount: total,
      currency,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/verify?order_id=${order.id}`,
      customer: {
        email: userProfile!.email,
        name: userProfile!.full_name,
        phonenumber: userProfile!.phone || undefined,
      },
      customizations: {
        title: 'AgriTrade Africa',
        description: `Order ${orderNumber}`,
        logo: `${process.env.NEXT_PUBLIC_APP_URL}/images/logo.svg`,
      },
      meta: {
        order_id: order.id,
      },
      payment_options: payment_method === 'mobilemoney' ? 'mobilemoney' : 'card,banktransfer',
    });

    await supabase.from('orders').update({ payment_reference: txRef }).eq('id', order.id);

    return NextResponse.json({
      success: true,
      data: {
        order_id: order.id,
        payment_link: payment.link,
        reference: txRef,
      },
    });
  } catch (error: unknown) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Payment initialization failed' },
      { status: 500 }
    );
  }
}
