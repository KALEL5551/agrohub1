'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';

interface PriceFilterProps {
  onApply: (min: number | null, max: number | null) => void;
  currency?: string;
}

export function PriceFilter({ onApply, currency = 'UGX' }: PriceFilterProps) {
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  const handleApply = () => {
    onApply(min ? Number(min) : null, max ? Number(max) : null);
  };

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-sm">Price Range ({currency})</h4>
      <div className="flex gap-2 items-center">
        <Input
          type="number"
          placeholder="Min"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className="w-24"
        />
        <span className="text-muted-foreground">—</span>
        <Input
          type="number"
          placeholder="Max"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="w-24"
        />
        <Button type="button" size="sm" onClick={handleApply}>
          Apply
        </Button>
      </div>
    </div>
  );
}
