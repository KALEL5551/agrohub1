'use client';

/**
 * CurrencySwitcher
 *
 * A compact dropdown that lets the user manually override their display currency.
 * Shows their detected currency by default with flag emoji.
 *
 * Usage: place in the <Header /> next to the cart icon.
 *
 *   import { CurrencySwitcher } from '@/components/payments/currency-switcher';
 *   <CurrencySwitcher />
 */

import { useCurrencyStore } from '@/lib/forex/currency-store';
import { CURRENCY_META } from '@/lib/forex/rates';

// The currencies shown in the dropdown (most traded globally)
const POPULAR_CURRENCIES = [
  'USD','EUR','GBP','JPY','CNY','INR','BRL','AUD','CAD','CHF',
  'MXN','KRW','SGD','HKD','NOK','SEK','DKK','PLN','MYR','PHP',
  'ZAR','NGN','KES','UGX','GHS','EGP','ETB','TZS','RWF','MAD',
  'SAR','AED','TRY','RUB','IDR','VND','THB','PKR','BDT','ILS',
  'ARS','CLP','COP','PEN','NZD','TWD','XOF','XAF',
];

export function CurrencySwitcher() {
  const { userCurrency, setUserCurrency } = useCurrencyStore();
  const meta = CURRENCY_META[userCurrency] ?? { symbol: userCurrency, flag: '🌐', name: userCurrency };

  return (
    <div className="relative inline-block">
      <select
        value={userCurrency}
        onChange={(e) => setUserCurrency(e.target.value)}
        className="appearance-none h-9 pl-2 pr-7 rounded-lg border border-input bg-background text-sm font-medium cursor-pointer hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        title="Change display currency"
        aria-label="Select display currency"
      >
        {POPULAR_CURRENCIES.map((code) => {
          const m = CURRENCY_META[code];
          if (!m) return null;
          return (
            <option key={code} value={code}>
              {m.flag} {code} — {m.name}
            </option>
          );
        })}
      </select>

      {/* Custom trigger display */}
      <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center gap-1">
        <span className="text-sm">{meta.flag}</span>
      </div>
    </div>
  );
}
