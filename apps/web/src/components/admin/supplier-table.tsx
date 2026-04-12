'use client';

import { DataTable, Badge, Avatar, Button } from '@/components/ui';
import { ShieldCheck, ShieldX, Eye } from 'lucide-react';
import type { User } from '@/types';

interface SupplierTableProps {
  suppliers: User[];
  onVerify: (id: string) => void;
  onView: (id: string) => void;
}

export function SupplierTable({ suppliers, onVerify, onView }: SupplierTableProps) {
  const columns = [
    {
      key: 'full_name',
      header: 'Supplier',
      render: (s: User) => (
        <div className="flex items-center gap-3">
          <Avatar src={s.avatar_url} name={s.full_name} size="sm" />
          <div>
            <p className="font-medium text-sm">{s.business_name || s.full_name}</p>
            <p className="text-xs text-muted-foreground">{s.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'country',
      header: 'Country',
    },
    {
      key: 'kyc_status',
      header: 'KYC',
      render: (s: User) => (
        <Badge
          variant={
            s.kyc_status === 'approved' ? 'success' : s.kyc_status === 'rejected' ? 'destructive' : 'warning'
          }
        >
          {s.kyc_status}
        </Badge>
      ),
    },
    {
      key: 'is_verified',
      header: 'Verified',
      render: (s: User) =>
        s.is_verified ? (
          <ShieldCheck className="h-5 w-5 text-primary" />
        ) : (
          <ShieldX className="h-5 w-5 text-muted-foreground" />
        ),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (s: User) => <span className="font-medium">{s.rating?.toFixed(1) || '—'}</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (s: User) => (
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="ghost" onClick={() => onView(s.id)}>
            <Eye className="h-4 w-4" />
          </Button>
          {!s.is_verified && (
            <Button type="button" size="sm" onClick={() => onVerify(s.id)}>
              Verify
            </Button>
          )}
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={suppliers} />;
}
