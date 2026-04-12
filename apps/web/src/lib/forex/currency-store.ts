/**
 * Agro Hub — Currency & Forex Zustand Store
 *
 * Persists:
 *  - userCurrency  : the user's active display currency (auto-detected or manually chosen)
 *  - userGeo       : detected country/city
 *  - rates         : latest exchange rate map
 *  - ratesLoadedAt : timestamp for cache invalidation
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GeoInfo } from './rates';

interface CurrencyState {
  /** The currency to display prices in (e.g. "KES") */
  userCurrency: string;
  /** Detected geo info */
  userGeo: GeoInfo | null;
  /** Live exchange rates, USD-based */
  rates: Record<string, number>;
  /** When were rates last fetched (ms) */
  ratesLoadedAt: number;
  /** Is forex system initialised */
  isInitialised: boolean;

  setUserCurrency: (currency: string) => void;
  setUserGeo: (geo: GeoInfo) => void;
  setRates: (rates: Record<string, number>) => void;
  setInitialised: () => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      userCurrency: 'USD',
      userGeo: null,
      rates: {},
      ratesLoadedAt: 0,
      isInitialised: false,

      setUserCurrency: (currency) => set({ userCurrency: currency }),
      setUserGeo: (geo) => set({ userGeo: geo, userCurrency: geo.currency }),
      setRates: (rates) => set({ rates, ratesLoadedAt: Date.now() }),
      setInitialised: () => set({ isInitialised: true }),
    }),
    {
      name: 'agro_hub_currency',
      // Only persist currency choice + geo, not the full rates object (too large)
      partialize: (state) => ({
        userCurrency: state.userCurrency,
        userGeo: state.userGeo,
        ratesLoadedAt: state.ratesLoadedAt,
      }),
    }
  )
);
