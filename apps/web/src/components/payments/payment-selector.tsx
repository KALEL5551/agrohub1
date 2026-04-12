'use client';

/**
 * PaymentSelector
 *
 * Smart payment method picker that:
 *  - Shows payment methods relevant to the user's country
 *  - Hides methods not available in their region
 *  - Highlights their local method (e.g. MTN MoMo for Ugandans, PayPal for Americans)
 *  - Shows converted price in the user's currency
 *
 * Usage in checkout page:
 *   <PaymentSelector
 *     control={control}
 *     register={register}
 *     watch={watch}
 *     amount={total}
 *     fromCurrency={listingCurrency}
 *   />
 */

import { CreditCard, Smartphone, Building2, Bitcoin, Globe } from 'lucide-react';
import { useCurrencyStore } from '@/lib/forex/currency-store';
import { useCurrency } from '@/hooks/use-currency';
import { getPaymentProvider } from '@/lib/payments';
import { CURRENCY_META } from '@/lib/forex/rates';
import { ConversionBadge } from './price-display';

interface PaymentOption {
  value: string;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  available: (country: string) => boolean;
  recommended?: (country: string) => boolean;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    value: 'card',
    label: 'Credit / Debit Card',
    subtitle: 'Visa, Mastercard, Amex — all countries',
    icon: <CreditCard className="h-5 w-5" />,
    available: () => true,
    recommended: (country) => !isMomoCountry(country),
  },
  {
    value: 'paypal',
    label: 'PayPal',
    subtitle: 'Fast global payment, buyer protection',
    icon: <Globe className="h-5 w-5" />,
    available: () => true,
    recommended: (country) => ['United States','United Kingdom','Germany','France','Australia','Canada','Netherlands','Spain','Italy','Japan'].includes(country),
  },
  {
    value: 'mobilemoney',
    label: 'Mobile Money',
    subtitle: 'MTN MoMo, Airtel Money, M-Pesa',
    icon: <Smartphone className="h-5 w-5" />,
    available: (country) => isMomoCountry(country),
    recommended: (country) => isMomoCountry(country),
  },
  {
    value: 'bank_transfer',
    label: 'Bank Transfer / SWIFT',
    subtitle: 'For large B2B orders — 1–3 business days',
    icon: <Building2 className="h-5 w-5" />,
    available: () => true,
  },
  {
    value: 'crypto',
    label: 'Crypto',
    subtitle: 'USDT, BTC via Binance Pay',
    icon: <Bitcoin className="h-5 w-5" />,
    available: () => true,
  },
];

const MOMO_COUNTRIES = new Set([
  'Uganda','Rwanda','Ghana','Kenya','Tanzania','Zambia','Nigeria',
  'Cameroon','Malawi','Mozambique','Congo (DRC)','Madagascar','Chad',
  "Cote d'Ivoire",'Senegal','Mali','Burkina Faso','Niger','Togo','Benin','Guinea',
  'Sierra Leone','Ethiopia','South Sudan','Zimbabwe','Angola',
]);

function isMomoCountry(country: string) {
  return MOMO_COUNTRIES.has(country);
}

interface PaymentSelectorProps {
  selectedMethod: string;
  onSelect: (method: string) => void;
  amount: number;
  fromCurrency: string;
}

export function PaymentSelector({
  selectedMethod,
  onSelect,
  amount,
  fromCurrency,
}: PaymentSelectorProps) {
  const { userGeo } = useCurrencyStore();
  const { displayPrice, userCurrency } = useCurrency();
  const country = userGeo?.country || 'United States';

  const availableOptions = PAYMENT_OPTIONS.filter(opt => opt.available(country));
  const convertedPrice = displayPrice(amount, fromCurrency);
  const currencyMeta = CURRENCY_META[userCurrency];

  return (
    <div className="space-y-4">
      {/* Converted price display */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">You will be charged</p>
          <p className="text-2xl font-bold text-primary">{convertedPrice}</p>
        </div>
        <div className="text-right">
          <ConversionBadge fromCurrency={fromCurrency} />
          {userGeo && (
            <p className="text-xs text-muted-foreground mt-1">
              Detected location: {userGeo.flag && <span>{currencyMeta?.flag} </span>}
              {userGeo.country}
            </p>
          )}
        </div>
      </div>

      {/* Payment method options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {availableOptions.map(opt => {
          const isRecommended = opt.recommended?.(country);
          const isSelected = selectedMethod === opt.value;

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`relative flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/40 hover:bg-muted/30'
              }`}
            >
              {isRecommended && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              )}
              <span className={`mt-0.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                {opt.icon}
              </span>
              <div>
                <p className={`font-semibold text-sm ${isSelected ? 'text-primary' : ''}`}>
                  {opt.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{opt.subtitle}</p>
                {opt.value === 'mobilemoney' && isMomoCountry(country) && (
                  <p className="text-xs text-primary font-medium mt-1">
                    Available in {country} ✓
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bank transfer instructions */}
      {selectedMethod === 'bank_transfer' && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm">
          <p className="font-semibold text-amber-800 mb-1">Bank Transfer Instructions</p>
          <p className="text-amber-700">
            After placing your order, you will receive our bank account details by email.
            Transfer the exact amount in <strong>{userCurrency}</strong> and quote your order number as reference.
            Orders are confirmed within 1–3 business days.
          </p>
        </div>
      )}

      {/* Crypto instructions */}
      {selectedMethod === 'crypto' && (
        <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-sm">
          <p className="font-semibold text-purple-800 mb-1">Crypto Payment via Binance Pay</p>
          <p className="text-purple-700">
            We accept USDT (TRC20/ERC20) and BTC. After placing your order,
            you will be redirected to complete payment. Price converted to USDT equivalent.
          </p>
        </div>
      )}
    </div>
  );
}
