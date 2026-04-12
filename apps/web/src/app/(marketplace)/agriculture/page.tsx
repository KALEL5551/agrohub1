'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/use-products';
import { ProductGrid } from '@/components/marketplace/product-grid';
import { CategoryFilter } from '@/components/marketplace/category-filter';
import { SearchBar } from '@/components/marketplace/search-bar';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { Leaf } from 'lucide-react';

export default function AgriculturePage() {
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const { products, total, isLoading } = useProducts({
    category: 'agriculture',
    subcategory: subcategory || undefined,
  });

  return (
    <div className="container-main py-8">
      <Breadcrumb items={[{ label: 'Agriculture' }]} />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-brand-green-100">
            <Leaf className="h-6 w-6 text-brand-green-600" />
          </div>
          <h1 className="text-3xl font-heading font-bold">Agriculture</h1>
        </div>
        <p className="text-muted-foreground">
          Seeds, crops, produce, farm inputs, tools, and more from verified African suppliers.
        </p>
      </div>

      <div className="mb-6">
        <SearchBar placeholder="Search agriculture products..." />
      </div>

      <div className="mb-6">
        <CategoryFilter
          category="agriculture"
          activeSubcategory={subcategory}
          onSubcategoryChange={setSubcategory}
        />
      </div>

      <p className="text-sm text-muted-foreground mb-4">{total} products</p>

      <ProductGrid products={products} isLoading={isLoading} />
    </div>
  );
}
