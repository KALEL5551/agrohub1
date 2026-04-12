'use client';

import Link from 'next/link';
import { ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react';
import { CartItem } from '@/components/marketplace/cart-item';
import { Button, Card } from '@/components/ui';
import { useCart } from '@/hooks/use-cart';
import { formatCurrency, calculateCommission } from '@/lib/utils';

export default function CartPage() {
  const { items, total, itemCount, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-main py-20 text-center">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-heading font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Browse our marketplace to find products</p>
        <Link href="/products">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  const currency = items[0]?.product.currency || 'UGX';
  const commission = calculateCommission(total);

  return (
    <div className="container-main py-8">
      <h1 className="text-2xl font-heading font-bold mb-6">Shopping Cart ({itemCount} items)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
          <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive">
            Clear Cart
          </Button>
        </div>

        <div>
          <Card className="p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
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
                <span className="text-primary text-xs">Calculated at checkout</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-base font-bold">
                <span>Total</span>
                <span>{formatCurrency(total + commission, currency)}</span>
              </div>
            </div>

            <Link href="/checkout" className="block mt-6">
              <Button className="w-full" size="lg">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="/products" className="block mt-3">
              <Button variant="ghost" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
