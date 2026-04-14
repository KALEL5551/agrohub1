'use client';

import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui';
import { useCart } from '@/hooks/use-cart';
import { formatCurrency, getProductImageUrl } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/types/database';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  return (
    <div className="flex gap-4 p-4 border rounded-lg">
      <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        {product.images?.[0] ? (
          <Image
            src={getProductImageUrl(product.images[0])}
            alt={product.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-2xl">📦</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm truncate">{product.title}</h3>
        <p className="text-xs text-muted-foreground">
          {formatCurrency(product.price, product.currency)} / {product.unit}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            type="button"
            onClick={() => updateQuantity(product.id, quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm font-medium w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            type="button"
            onClick={() => updateQuantity(product.id, quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <span className="font-bold text-sm">
          {formatCurrency(product.price * quantity, product.currency)}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive"
          type="button"
          onClick={() => removeItem(product.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
