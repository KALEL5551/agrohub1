'use client';

/**
 * ForexProvider
 *
 * Drop this just inside your AuthProvider in root layout.tsx.
 * It silently detects the user's country on first load and
 * initialises the global currency store. No UI shown — purely
 * initialisation logic.
 *
 * Usage in layout.tsx:
 *   <AuthProvider>
 *     <ForexProvider>
 *       {children}
 *     </ForexProvider>
 *   </AuthProvider>
 */

import { type ReactNode, useEffect } from 'react';
import { fetchExchangeRates, detectUserGeo } from '@/lib/forex/rates';
import { useCurrencyStore } from '@/lib/forex/currency-store';

const RATE_TTL_MS = 60 * 60 * 1000;

export function ForexProvider({ children }: { children: ReactNode }) {
  const { isInitialised, ratesLoadedAt, rates, setUserGeo, setRates, setInitialised } =
    useCurrencyStore();

  useEffect(() => {
    // Skip if already initialised and rates are fresh
    if (isInitialised && Date.now() - ratesLoadedAt < RATE_TTL_MS && Object.keys(rates).length > 0) {
      return;
    }

    const boot = async () => {
      try {
        const [geo, freshRates] = await Promise.all([
          detectUserGeo(),
          fetchExchangeRates(),
        ]);
        setUserGeo(geo);
        setRates(freshRates);
      } catch {
        // Fail silently — fallback to USD
      } finally {
        setInitialised();
      }
    };

    boot();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
