'use client';

/**
 * PriceDisplay
 *
 * Replace every raw `formatCurrency(product.price, product.currency)` call
 * with this component and prices automatically show in the user's currency.
 *
 * Usage:
 *   <PriceDisplay amount={product.price} currency={product.currency} />
 *   // → "KSh 12,450.00" for a Kenyan visitor
 *   // → "$ 95.20"        for a US visitor
 *   // → "€ 87.50"        for a German visitor
 *
 * Props:
 *   amount     - original price number
 *   currency   - original listing currency code (e.g. "USD")
 *   size       - "sm" | "md" | "lg" — controls font size
 *   showOriginal - also show original currency in small text below
 */

import { useCurrency } from '@/hooks/use-currency';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  amount: number;
  currency: string;
  size?: 'sm' | 'md' | 'lg';
  showOriginal?: boolean;
  className?: string;
  unit?: string; // e.g. "/kg"
}

export function PriceDisplay({
  amount,
  currency,
  size = 'md',
  showOriginal = false,
  className,
  unit,
}: PriceDisplayProps) {
  const { displayPrice, userCurrency, isLoading } = useCurrency();

  const sizeClass = {
    sm:  'text-sm font-medium',
    md:  'text-lg font-bold',
    lg:  'text-3xl font-bold',
  }[size];

  const converted = displayPrice(amount, currency);
  const isConverted = userCurrency !== currency;

  if (isLoading) {
    return (
      <span className={cn('animate-pulse bg-muted rounded w-20 h-5 inline-block', className)} />
    );
  }

  return (
    <span className={cn('inline-flex flex-col', className)}>
      <span className={cn(sizeClass, 'text-primary')}>
        {converted}
        {unit && <span className="text-xs text-muted-foreground font-normal ml-0.5">{unit}</span>}
      </span>
      {showOriginal && isConverted && (
        <span className="text-xs text-muted-foreground">
          Originally: {currency} {amount.toLocaleString()}
        </span>
      )}
    </span>
  );
}

/**
 * ConversionBadge
 *
 * Small inline badge showing the conversion rate.
 * Good to show once on checkout or product detail pages.
 *
 * Usage:
 *   <ConversionBadge from="USD" to="KES" rates={rates} />
 *   // → "1 USD = 128.40 KES"
 */
import { useCurrencyStore } from '@/lib/forex/currency-store';
import { convertPrice, CURRENCY_META } from '@/lib/forex/rates';

export function ConversionBadge({ fromCurrency }: { fromCurrency: string }) {
  const { userCurrency, rates } = useCurrencyStore();

  if (!rates || userCurrency === fromCurrency) return null;

  const rate = convertPrice(1, fromCurrency, userCurrency, rates);
  const meta = CURRENCY_META[userCurrency];

  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
      <span>💱</span>
      1 {fromCurrency} ≈ {meta?.symbol}{rate.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} {userCurrency}
    </span>
  );
}
