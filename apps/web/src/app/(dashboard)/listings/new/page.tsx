'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Card } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/auth-store';
import {
  AGRO_SECTORS,
  AGRICULTURE_SUBCATEGORIES,
  CROP_PRODUCT_TYPES,
  LIVESTOCK_PRODUCT_TYPES,
  FISH_PRODUCT_TYPES,
  UNITS,
  CURRENCIES,
  WORLD_COUNTRIES,
} from '@/lib/constants';
import { slugify } from '@/lib/utils';
import { toast } from 'sonner';
import type { Metadata } from 'next';

const listingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  sector: z.string().min(1, 'Select a sector'),
  subcategory: z.string().min(1, 'Select a specific crop / animal / species'),
  product_type: z.string().min(1, 'Select what you are offering'),
  trade_type: z.enum(['b2b', 'b2c', 'both']),
  price: z.coerce.number().positive('Price must be positive'),
  currency: z.string().min(1),
  unit: z.string().min(1),
  min_order_quantity: z.coerce.number().positive(),
  max_order_quantity: z.coerce.number().optional(),
  stock_quantity: z.coerce.number().positive(),
  origin_country: z.string().min(1),
  tags: z.string().optional(),
});

type ListingValues = z.infer<typeof listingSchema>;

export default function NewListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultSector = searchParams.get('sector') || 'cash_crops';
  const defaultSubcategory = searchParams.get('subcategory') || '';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ListingValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      sector: defaultSector,
      subcategory: defaultSubcategory,
      trade_type: 'both',
      currency: 'USD',
      unit: 'kg',
      min_order_quantity: 1,
      stock_quantity: 100,
      origin_country: user?.country || 'Uganda',
    },
  });

  const watchedSector = watch('sector');
  const isLivestock = ['livestock', 'poultry'].includes(watchedSector);
  const isFish = watchedSector === 'fisheries';

  const subcategoryOptions = AGRICULTURE_SUBCATEGORIES.filter(s => s.sector === watchedSector);
  const productTypeOptions = isLivestock
    ? LIVESTOCK_PRODUCT_TYPES
    : isFish
    ? FISH_PRODUCT_TYPES
    : CROP_PRODUCT_TYPES;

  const onSubmit = async (values: ListingValues) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('products').insert({
        supplier_id: user.id,
        title: values.title,
        slug: slugify(values.title),
        description: values.description,
        category: values.sector,
        subcategory: values.subcategory,
        product_type: values.product_type,
        trade_type: values.trade_type,
        price: values.price,
        currency: values.currency,
        unit: values.unit,
        min_order_quantity: values.min_order_quantity,
        max_order_quantity: values.max_order_quantity || null,
        stock_quantity: values.stock_quantity,
        origin_country: values.origin_country,
        tags: values.tags ? values.tags.split(',').map(t => t.trim()) : [],
        listing_status: 'pending_review',
        images: [],
        specifications: {},
      });
      if (error) throw error;
      toast.success('Listing submitted! Our team will review and publish it shortly.');
      router.push('/listings');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading font-bold mb-2">Create New Listing</h1>
      <p className="text-muted-foreground mb-6">
        List your agricultural product, medicine, seed, service, or produce for buyers worldwide.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ── PRODUCT DETAILS ── */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">Product Details</h2>

          <Input
            label="Product Title"
            placeholder="e.g., Organic Tomato Fungicide – Mancozeb 80% WP"
            error={errors.title?.message}
            {...register('title')}
          />

          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <textarea
              className="w-full h-32 rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none"
              placeholder="Describe your product — quality, certifications, packaging, shipping info..."
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Sector */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Agro Sector</label>
              <select
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                {...register('sector')}
              >
                {AGRO_SECTORS.map(s => (
                  <option key={s.value} value={s.value}>
                    {s.icon} {s.label}
                  </option>
                ))}
              </select>
              {errors.sector && <p className="mt-1 text-sm text-destructive">{errors.sector.message}</p>}
            </div>

            {/* Specific crop/animal */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                {isLivestock ? 'Animal Type' : isFish ? 'Species' : 'Crop / Item'}
              </label>
              <select
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                {...register('subcategory')}
              >
                <option value="">Select...</option>
                {subcategoryOptions.map(s => (
                  <option key={s.value} value={s.value}>
                    {s.icon} {s.label}
                  </option>
                ))}
              </select>
              {errors.subcategory && (
                <p className="mt-1 text-sm text-destructive">{errors.subcategory.message}</p>
              )}
            </div>
          </div>

          {/* Product type */}
          <div>
            <label className="block text-sm font-medium mb-1.5">What are you offering?</label>
            <select
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
              {...register('product_type')}
            >
              <option value="">Select product type...</option>
              {productTypeOptions.map(t => (
                <option key={t.value} value={t.value}>
                  {t.icon} {t.label}
                </option>
              ))}
            </select>
            {errors.product_type && (
              <p className="mt-1 text-sm text-destructive">{errors.product_type.message}</p>
            )}
          </div>

          {/* Trade type */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Trade Type</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'both', label: 'B2B & B2C', desc: 'Both businesses and individuals' },
                { value: 'b2b', label: 'B2B Only', desc: 'Businesses / bulk orders' },
                { value: 'b2c', label: 'B2C Only', desc: 'Individual / retail orders' },
              ].map(opt => (
                <label key={opt.value} className="cursor-pointer">
                  <input type="radio" value={opt.value} className="sr-only" {...register('trade_type')} />
                  <div className={`p-3 rounded-lg border-2 text-center transition-colors text-sm ${
                    watch('trade_type') === opt.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40'
                  }`}>
                    <p className="font-semibold">{opt.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </Card>

        {/* ── PRICING & INVENTORY ── */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">Pricing & Inventory</h2>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Price" type="number" step="0.01" error={errors.price?.message} {...register('price')} />
            <div>
              <label className="block text-sm font-medium mb-1.5">Currency</label>
              <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm" {...register('currency')}>
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Unit</label>
              <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm" {...register('unit')}>
                {UNITS.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Min Order Qty" type="number" {...register('min_order_quantity')} />
            <Input label="Max Order Qty" type="number" placeholder="Optional" {...register('max_order_quantity')} />
            <Input label="Stock Qty" type="number" {...register('stock_quantity')} />
          </div>
        </Card>

        {/* ── ORIGIN & TAGS ── */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">Origin & Tags</h2>
          <div>
            <label className="block text-sm font-medium mb-1.5">Origin Country</label>
            <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm" {...register('origin_country')}>
              {WORLD_COUNTRIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <Input
            label="Tags (comma-separated)"
            placeholder="organic, certified, bulk, non-GMO"
            {...register('tags')}
          />
        </Card>

        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
          Submit for Review
        </Button>
      </form>
    </div>
  );
}
