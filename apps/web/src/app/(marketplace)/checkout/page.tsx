'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Smartphone, Lock, Building2, Bitcoin } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { ShippingCalculator } from '@/components/shipping/shipping-calculator';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { formatCurrency, calculateCommission } from '@/lib/utils';
import { WORLD_COUNTRIES, SHIPPING_TYPES } from '@/lib/constants';
import { toast } from 'sonner';

const checkoutSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string().min(6),
  address_line_1: z.string().min(5),
  address_line_2: z.string().optional(),
  city: z.string().min(2),
  country: z.string().min(1),
  postal_code: z.string().optional(),
  payment_method: z.enum(['card', 'paypal', 'mobilemoney', 'bank_transfer', 'crypto']),
  shipping_type: z.enum(['b2b_bulk', 'b2c_courier', 'local', 'pickup']),
  order_notes: z.string().optional(),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

const PAYMENT_OPTIONS = [
  { value: 'card',          label: 'Credit / Debit Card',   subtitle: 'Visa, Mastercard, Amex', icon: CreditCard },
  { value: 'paypal',        label: 'PayPal',                subtitle: 'Fast & secure global payment', icon: CreditCard },
  { value: 'mobilemoney',   label: 'Mobile Money',          subtitle: 'MTN MoMo, Airtel, M-Pesa', icon: Smartphone },
  { value: 'bank_transfer', label: 'Bank Transfer / SWIFT', subtitle: 'For large B2B orders', icon: Building2 },
  { value: 'crypto',        label: 'Crypto',                subtitle: 'USDT, BTC via Binance Pay', icon: Bitcoin },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      phone: user?.phone || '',
      country: user?.country || '',
      payment_method: 'card',
      shipping_type: 'b2c_courier',
    },
  });

  const paymentMethod = watch('payment_method');
  const shippingType = watch('shipping_type');
  const currency = items[0]?.product.currency || 'USD';
  const commission = calculateCommission(total);
  const shippingCost = 0;

  const onSubmit = async (values: CheckoutValues) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({ product_id: item.product.id, quantity: item.quantity })),
          shipping_address: {
            full_name: values.full_name,
            phone: values.phone,
            address_line_1: values.address_line_1,
            address_line_2: values.address_line_2,
            city: values.city,
            country: values.country,
            postal_code: values.postal_code,
          },
          payment_method: values.payment_method,
          shipping_type: values.shipping_type,
          order_notes: values.order_notes,
        }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      if (data.data.payment_link) {
        window.location.href = data.data.payment_link;
      } else {
        toast.success('Order placed successfully!');
        clearCart();
        router.push(`/orders/${data.data.order_id}`);
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Checkout failed');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (items.length === 0) router.replace('/cart');
  }, [items.length, router]);

  if (items.length === 0) return null;

  return (
    <div className="container-main py-8">
      <h1 className="text-2xl font-heading font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* SHIPPING ADDRESS */}
            <Card className="p-6">
              <h2 className="font-semibold text-lg mb-4">Delivery Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" error={errors.full_name?.message} {...register('full_name')} />
                <Input label="Phone / WhatsApp" error={errors.phone?.message} {...register('phone')} />
                <div className="sm:col-span-2">
                  <Input label="Address Line 1" error={errors.address_line_1?.message} {...register('address_line_1')} />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Address Line 2 (optional)" {...register('address_line_2')} />
                </div>
                <Input label="City" error={errors.city?.message} {...register('city')} />
                <div>
                  <label className="block text-sm font-medium mb-1.5">Country</label>
                  <select
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                    {...register('country')}
                  >
                    <option value="">Select country</option>
                    {WORLD_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <Input label="Postal Code (optional)" {...register('postal_code')} />
              </div>
            </Card>

            {/* SHIPPING TYPE */}
            <Card className="p-6">
              <h2 className="font-semibold text-lg mb-4">Shipping Method</h2>
              <div className="grid grid-cols-2 gap-3">
                {SHIPPING_TYPES.map(opt => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      shippingType === opt.value ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <input type="radio" value={opt.value} className="sr-only" {...register('shipping_type')} />
                    <span className="text-xl mt-0.5">{opt.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </Card>

            {/* PAYMENT METHOD */}
            <Card className="p-6">
              <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  return (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        paymentMethod === opt.value ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <input type="radio" value={opt.value} className="sr-only" {...register('payment_method')} />
                      <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.subtitle}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </Card>

            {/* SHIPPING CALCULATOR */}
            <ShippingCalculator />

            {/* ORDER NOTES */}
            <Card className="p-6">
              <h2 className="font-semibold text-lg mb-3">Order Notes (optional)</h2>
              <textarea
                className="w-full h-24 rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none"
                placeholder="Special packaging instructions, delivery time preferences, B2B reference numbers..."
                {...register('order_notes')}
              />
            </Card>
          </div>

          {/* ORDER SUMMARY */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm mb-6">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between">
                    <span className="truncate max-w-[180px]">
                      {item.product.title} ×{item.quantity}
                    </span>
                    <span>{formatCurrency(item.product.price * item.quantity, currency)}</span>
                  </div>
                ))}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(total, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee (5%)</span>
                    <span>{formatCurrency(commission, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shippingCost ? formatCurrency(shippingCost, currency) : 'TBD'}</span>
                  </div>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>{formatCurrency(total + commission + shippingCost, currency)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <Lock className="h-3 w-3" />
                Payment held in escrow — released only after you confirm delivery
              </div>
              <Button type="submit" className="w-full" size="lg" isLoading={isProcessing}>
                Place Order & Pay
              </Button>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
