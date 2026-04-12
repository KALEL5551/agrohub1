'use client';

/**
 * Agro Hub — useCurrency hook
 *
 * Usage:
 *   const { displayPrice, userCurrency, setUserCurrency, isLoading } = useCurrency();
 *   const price = displayPrice(product.price, product.currency);
 *   // → "KSh 12,450.00"  (auto-converted from USD to KES if user is in Kenya)
 */

import { useEffect, useState, useCallback } from 'react';
import { useCurrencyStore } from '@/lib/forex/currency-store';
import {
  fetchExchangeRates,
  detectUserGeo,
  convertPrice,
  formatConvertedPrice,
  CURRENCY_META,
} from '@/lib/forex/rates';

const RATE_TTL_MS = 60 * 60 * 1000; // 1 hour

export function useCurrency() {
  const {
    userCurrency,
    rates,
    ratesLoadedAt,
    isInitialised,
    setUserCurrency,
    setUserGeo,
    setRates,
    setInitialised,
  } = useCurrencyStore();

  const [isLoading, setIsLoading] = useState(!isInitialised);

  // On mount: detect geo + fetch rates if not cached
  useEffect(() => {
    if (isInitialised && Date.now() - ratesLoadedAt < RATE_TTL_MS && Object.keys(rates).length > 0) {
      setIsLoading(false);
      return;
    }

    const init = async () => {
      setIsLoading(true);
      try {
        const [geoInfo, freshRates] = await Promise.all([
          detectUserGeo(),
          fetchExchangeRates(),
        ]);

        setUserGeo(geoInfo);   // also sets userCurrency to detected currency
        setRates(freshRates);
        setInitialised();
      } catch {
        // silently fall back to USD
        setInitialised();
      } finally {
        setIsLoading(false);
      }
    };

    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Convert and format a price from its original currency to the user's currency.
   * @param amount   The price (e.g. 25.00)
   * @param fromCurrency  The original listing currency (e.g. "USD")
   * @returns  Formatted string e.g. "KSh 2,840.00"
   */
  const displayPrice = useCallback(
    (amount: number, fromCurrency: string = 'USD'): string => {
      if (!Object.keys(rates).length) {
        // Rates not loaded yet — show original
        const meta = CURRENCY_META[fromCurrency];
        return `${meta?.symbol ?? fromCurrency} ${amount.toLocaleString()}`;
      }
      return formatConvertedPrice(amount, fromCurrency, userCurrency, rates);
    },
    [rates, userCurrency]
  );

  /**
   * Get the raw converted numeric value (for sending to payment API).
   */
  const convertAmount = useCallback(
    (amount: number, fromCurrency: string = 'USD'): number => {
      if (!Object.keys(rates).length) return amount;
      return convertPrice(amount, fromCurrency, userCurrency, rates);
    },
    [rates, userCurrency]
  );

  const currencyMeta = CURRENCY_META[userCurrency] ?? { name: userCurrency, symbol: userCurrency, flag: '🌐' };

  return {
    userCurrency,
    currencyMeta,
    setUserCurrency,
    displayPrice,
    convertAmount,
    rates,
    isLoading,
  };
}
