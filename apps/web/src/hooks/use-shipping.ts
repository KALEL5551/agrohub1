'use client';

import { useState } from 'react';
import type { ShippingQuote } from '@/types';

export function useShipping() {
  const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getQuotes = async (params: {
    originCountry: string;
    destinationCountry: string;
    weightKg: number;
    dimensions?: { length: number; width: number; height: number };
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/shipping/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin_country: params.originCountry,
          destination_country: params.destinationCountry,
          weight_kg: params.weightKg,
          dimensions: params.dimensions,
        }),
      });

      const data = await response.json();

      if (!data.success) throw new Error(data.error);
      setQuotes(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get shipping quotes');
    } finally {
      setIsLoading(false);
    }
  };

  return { quotes, isLoading, error, getQuotes };
}
