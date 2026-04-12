import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProductDetail } from '@/components/marketplace/product-detail';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import type { Product } from '@/types';
import type { Metadata } from 'next';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from('products').select('title, description').eq('id', params.id).single();
  return {
    title: data?.title || 'Product',
    description: data?.description?.slice(0, 160) || '',
  };
}

export default async function ProductPage({ params }: Props) {
  const supabase = createServerSupabaseClient();
  const { data: product } = await supabase
    .from('products')
    .select('*, supplier:users!supplier_id(*)')
    .eq('id', params.id)
    .single();

  if (!product) notFound();

  const p = product as Product;

  return (
    <div className="container-main py-8">
      <Breadcrumb
        items={[
          { label: 'Marketplace', href: '/products' },
          { label: p.category, href: `/${p.category}` },
          { label: p.title },
        ]}
      />
      <ProductDetail product={p} />
    </div>
  );
}
