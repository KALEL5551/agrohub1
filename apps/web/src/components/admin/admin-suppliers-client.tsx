'use client';

import { useRouter } from 'next/navigation';
import { SupplierTable } from '@/components/admin/supplier-table';
import type { User } from '@/types';

export function AdminSuppliersClient({ suppliers }: { suppliers: User[] }) {
  const router = useRouter();

  return (
    <SupplierTable
      suppliers={suppliers}
      onVerify={(_id) => {
        /* wire to API / server action */
      }}
      onView={(id) => router.push(`/admin/suppliers/${id}`)}
    />
  );
}
