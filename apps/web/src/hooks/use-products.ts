'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Product, ProductCategory } from '@/types';

interface UseProductsOptions {
  category?: ProductCategory;
  subcategory?: string;
  search?: string;
  sortBy?: 'created_at' | 'price' | 'rating' | 'views';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  page?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const {
        category,
        subcategory,
        search,
        sortBy = 'created_at',
        sortOrder = 'desc',
        limit = 20,
        page = 1,
      } = options;

      let query = supabase
        .from('products')
        .select('*, supplier:users!supplier_id(id, full_name, business_name, avatar_url, country, rating, is_verified)', {
          count: 'exact',
        })
        .eq('listing_status', 'active');

      if (category) query = query.eq('category', category);
      if (subcategory) query = query.eq('subcategory', subcategory);
      if (search) query = query.ilike('title', `%${search}%`);

      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range((page - 1) * limit, page * limit - 1);

      const { data, count, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setProducts(data as Product[]);
      setTotal(count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  }, [
    supabase,
    options.category,
    options.subcategory,
    options.search,
    options.sortBy,
    options.sortOrder,
    options.limit,
    options.page,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, total, isLoading, error, refetch: fetchProducts };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*, supplier:users!supplier_id(*)')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setProduct(data as Product);

        await supabase.rpc('increment_product_views', { product_id: id });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, supabase]);

  return { product, isLoading, error };
}
