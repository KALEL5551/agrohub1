'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/use-products';
import { ProductGrid } from '@/components/marketplace/product-grid';
import { SearchBar } from '@/components/marketplace/search-bar';
import { CategoryFilter } from '@/components/marketplace/category-filter';
import { PriceFilter } from '@/components/marketplace/price-filter';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { Button, Badge } from '@/components/ui';
import { AGRO_SECTORS, CROP_PRODUCT_TYPES, WORLD_COUNTRIES } from '@/lib/constants';

export function ProductsPageClient() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sector, setSector] = useState(searchParams.get('sector') || '');
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [productType, setProductType] = useState(searchParams.get('product_type') || '');
  const [originCountry, setOriginCountry] = useState('');
  const [tradeType, setTradeType] = useState('');
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
        {/* SIDEBAR */}
        <aside className="w-full lg:w-64 space-y-6 flex-shrink-0">

          {/* Sort */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Sort By</h3>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="created_at">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Sector filter */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Sector</h3>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => { setSector(''); setSubcategory(null); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  !sector ? 'bg-primary text-white' : 'hover:bg-muted'
                }`}
              >
                All Sectors
              </button>
              {AGRO_SECTORS.map(s => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => { setSector(s.value); setSubcategory(null); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                    sector === s.value ? 'bg-primary text-white' : 'hover:bg-muted'
                  }`}
                >
                  <span>{s.icon}</span> {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product type */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Product Type</h3>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setProductType('')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  !productType ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
                }`}
              >
                All Types
              </button>
              {CROP_PRODUCT_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setProductType(t.value === productType ? '' : t.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                    productType === t.value ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
                  }`}
                >
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Country */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Source Country</h3>
            <select
              value={originCountry}
              onChange={e => setOriginCountry(e.target.value)}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="">All Countries</option>
              {WORLD_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Trade type */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Trade Type</h3>
            <div className="flex gap-2 flex-wrap">
              {['', 'b2b', 'b2c', 'both'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTradeType(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    tradeType === t
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {t === '' ? 'All' : t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <PriceFilter onApply={() => {}} />
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1">
          <div className="mb-6">
            <SearchBar defaultValue={search} placeholder="Search tomato seeds, arabica coffee, tilapia..." />
          </div>

          <div className="mb-6">
            <CategoryFilter
              sector={sector || 'all'}
              activeSubcategory={subcategory}
              onSubcategoryChange={setSubcategory}
            />
          </div>

          {/* Active filters */}
          {(sector || productType || originCountry || tradeType) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {sector && (
                <Badge variant="muted">
                  Sector: {AGRO_SECTORS.find(s => s.value === sector)?.label}
                  <button type="button" className="ml-1 hover:text-destructive" onClick={() => setSector('')}>×</button>
                </Badge>
              )}
              {productType && (
                <Badge variant="muted">
                  Type: {CROP_PRODUCT_TYPES.find(t => t.value === productType)?.label}
                  <button type="button" className="ml-1 hover:text-destructive" onClick={() => setProductType('')}>×</button>
                </Badge>
              )}
              {originCountry && (
                <Badge variant="muted">
                  Country: {originCountry}
                  <button type="button" className="ml-1 hover:text-destructive" onClick={() => setOriginCountry('')}>×</button>
                </Badge>
              )}
              {tradeType && (
                <Badge variant="muted">
                  {tradeType.toUpperCase()}
                  <button type="button" className="ml-1 hover:text-destructive" onClick={() => setTradeType('')}>×</button>
                </Badge>
              )}
            </div>
          )}

          <p className="text-sm text-muted-foreground mb-4">
            Showing {products.length} of {total} products
          </p>

          <ProductGrid products={products} isLoading={isLoading} />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
