import { Suspense } from 'react';
import { Spinner } from '@/components/ui';
import { ProductsPageClient } from './products-page-client';

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container-main py-20 flex justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <ProductsPageClient />
    </Suspense>
  );
}
