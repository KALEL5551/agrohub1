'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/use-products';
import { ProductGrid } from '@/components/marketplace/product-grid';
import { SearchBar } from '@/components/marketplace/search-bar';
import { CategoryFilter } from '@/components/marketplace/category-filter';
import { PriceFilter } from '@/components/marketplace/price-filter';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { Button } from '@/components/ui';

export function ProductsPageClient() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [search, setSearch] = useState(initialSearch);
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'created_at' | 'price' | 'rating'>('created_at');
  const [page, setPage] = useState(1);

  const { products, total, isLoading } = useProducts({
    search: search || undefined,
    subcategory: subcategory || undefined,
    sortBy,
    page,
    limit: 20,
  });

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="container-main py-8">
      <Breadcrumb items={[{ label: 'Marketplace' }]} />

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 space-y-6 flex-shrink-0">
          <div>
            <h3 className="font-semibold mb-3">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="created_at">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <PriceFilter onApply={() => {}} />
        </aside>

        <div className="flex-1">
          <div className="mb-6">
            <SearchBar defaultValue={search} />
          </div>

          <div className="mb-6">
            <CategoryFilter
              category="all"
              activeSubcategory={subcategory}
              onSubcategoryChange={setSubcategory}
            />
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Showing {products.length} of {total} products
          </p>

          <ProductGrid products={products} isLoading={isLoading} />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
