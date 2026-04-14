'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button, Badge, Spinner } from '@/components/ui';
import { DataTable } from '@/components/ui/data-table';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/auth-store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AGRO_SECTORS } from '@/lib/constants';

// ── Inline type so we never depend on an external types file ──────────────
interface Product {
  id: string;
  supplier_id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  subcategory: string;
  product_type?: string;
  price: number;
  currency: string;
  unit: string;
  min_order_quantity: number;
  max_order_quantity: number | null;
  stock_quantity: number;
  images: string[];
  specifications: Record<string, string>;
  tags: string[];
  origin_country: string;
  listing_status: string;
  is_featured: boolean;
  views: number;
  rating: number;
  total_reviews: number;
  trade_type?: string;
  created_at: string;
  updated_at: string;
}

export default function ListingsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;
    const fetchListings = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('supplier_id', user.id)
        .order('created_at', { ascending: false });
      setProducts((data as Product[]) || []);
      setIsLoading(false);
    };
    fetchListings();
  }, [user, supabase]);

  const columns = [
    {
      key: 'title',
      header: 'Product',
      render: (p: Product) => {
        const sector = AGRO_SECTORS.find((s) => s.value === p.category);
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-xl">
              {sector?.icon || '🌿'}
            </div>
            <div>
              <p className="font-medium text-sm">{p.title}</p>
              <p className="text-xs text-muted-foreground">
                {p.subcategory}
                {p.product_type ? ` • ${p.product_type}` : ''}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'price',
      header: 'Price',
      render: (p: Product) => (
        <span className="font-medium">
          {formatCurrency(p.price, p.currency)}/{p.unit}
        </span>
      ),
    },
    {
      key: 'stock_quantity',
      header: 'Stock',
      render: (p: Product) => (
        <Badge variant={p.stock_quantity > 0 ? 'success' : 'destructive'}>
          {p.stock_quantity > 0 ? `${p.stock_quantity} ${p.unit}` : 'Out of stock'}
        </Badge>
      ),
    },
    {
      key: 'listing_status',
      header: 'Status',
      render: (p: Product) => <Badge variant="muted">{p.listing_status}</Badge>,
    },
    {
      key: 'views',
      header: 'Views',
    },
    {
      key: 'created_at',
      header: 'Listed',
      render: (p: Product) => (
        <span className="text-muted-foreground text-xs">{formatDate(p.created_at)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (p: Product) => (
        <Link href={`/listings/${p.id}/edit`}>
          <Button variant="ghost" size="sm">Edit</Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">My Listings</h1>
        <Link href="/listings/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Listing
          </Button>
        </Link>
      </div>
      {isLoading ? (
        <Spinner className="py-20" />
      ) : (
        <DataTable
          columns={columns}
          data={products}
          emptyMessage="No listings yet. Create your first agricultural product listing!"
        />
      )}
    </div>
  );
}
