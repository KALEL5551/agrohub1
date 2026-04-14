import { Lock, Unlock, RefreshCw, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EscrowStatus } from '@/types/database';

const escrowConfig: Record<EscrowStatus, { icon: LucideIcon; label: string; color: string }> = {
  held: { icon: Lock, label: 'Funds Held in Escrow', color: 'text-blue-600 bg-blue-50' },
  released: { icon: Unlock, label: 'Funds Released to Supplier', color: 'text-green-600 bg-green-50' },
  refunded: { icon: RefreshCw, label: 'Funds Refunded to Buyer', color: 'text-orange-600 bg-orange-50' },
};

interface EscrowStatusProps {
  status: EscrowStatus;
}

export function EscrowStatusBadge({ status }: EscrowStatusProps) {
  const config = escrowConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn('inline-flex items-center gap-2 px-3 py-2 rounded-lg', config.color)}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  );
}
