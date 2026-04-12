'use client';

import { useState } from 'react';
import { Truck } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { useShipping } from '@/hooks/use-shipping';
import { WORLD_COUNTRIES } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

export function ShippingCalculator() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const { quotes, isLoading, error, getQuotes } = useShipping();

  const handleCalculate = () => {
    if (!origin || !destination || !weight) return;
    getQuotes({
      originCountry: origin,
      destinationCountry: destination,
      weightKg: Number(weight),
    });
  };

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
        <Truck className="h-5 w-5 text-primary" />
        Shipping Calculator
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Get live shipping quotes for your order — B2C courier or B2B freight worldwide.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Origin Country</label>
          <select
            value={origin}
            onChange={e => setOrigin(e.target.value)}
            className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="">Select origin</option>
            {WORLD_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Destination Country</label>
          <select
            value={destination}
            onChange={e => setDestination(e.target.value)}
            className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="">Select destination</option>
            {WORLD_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <Input
            label="Weight (kg)"
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder="e.g. 25"
          />
        </div>
      </div>

      <Button type="button" onClick={handleCalculate} isLoading={isLoading} disabled={!origin || !destination || !weight}>
        Get Shipping Quotes
      </Button>

      {error && <p className="text-sm text-destructive mt-3">{error}</p>}

      {quotes.length > 0 && (
        <div className="mt-4 space-y-2">
          {quotes.map((quote, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium text-sm">{quote.carrier} — {quote.service_name}</p>
                <p className="text-xs text-muted-foreground">Est. {quote.estimated_days} business days</p>
              </div>
              <span className="font-bold">{formatCurrency(quote.price, quote.currency)}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
