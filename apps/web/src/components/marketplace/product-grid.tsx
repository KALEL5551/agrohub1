import { ProductCard } from './product-card';
import { Spinner } from '@/components/ui';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function ProductGrid({ products, isLoading, emptyMessage }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">📦</p>
        <h3 className="text-lg font-semibold">No products found</h3>
        <p className="text-muted-foreground mt-1">
          {emptyMessage || 'Try adjusting your search or filters'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
