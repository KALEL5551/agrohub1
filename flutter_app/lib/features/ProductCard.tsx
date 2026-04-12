'use client';
// ============================================================
// AgriTrade Africa — ProductCard Component
// apps/web/src/components/marketplace/ProductCard.tsx
// ============================================================

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { formatUSD, formatUGX } from '../../lib/payments';
import type { Product } from '@agritrade/shared/types';

interface ProductCardProps {
  product: Product;
  exchangeRate?: number;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

export function ProductCard({
  product,
  exchangeRate = 3750,
  onAddToCart,
  className = '',
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const primaryImage = !imgError && product.images?.[0]
    ? product.images[0]
    : '/placeholder-product.png';

  const ugxPrice = product.price_ugx ?? Math.round(product.price_usd * exchangeRate);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className={`group block bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-green-200 hover:shadow-md transition-all duration-200 ${className}`}
    >
      {/* Product image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={primaryImage}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgError(true)}
        />

        {/* Category badge */}
        <span className={`absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full
          ${product.category === 'agriculture'
            ? 'bg-green-100 text-green-800'
            : 'bg-amber-100 text-amber-800'
          }`}
        >
          {product.category === 'agriculture' ? '🌱 Agri' : '⚡ Tech'}
        </span>

        {/* Featured badge */}
        {product.is_featured && (
          <span className="absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
            Featured
          </span>
        )}

        {/* Out of stock overlay */}
        {product.stock_qty !== null && product.stock_qty === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-500">Out of stock</span>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-3">
        {/* Supplier */}
        {product.supplier && (
          <div className="flex items-center gap-1.5 mb-1.5">
            {product.supplier.logo_url ? (
              <Image
                src={product.supplier.logo_url}
                alt={product.supplier.company_name}
                width={16}
                height={16}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-[8px] font-bold text-green-700">
                  {product.supplier.company_name.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-xs text-gray-500 truncate">
              {product.supplier.company_name}
            </span>
            {product.supplier.is_verified && (
              <svg className="w-3 h-3 text-green-500 flex-shrink-0" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 0L7.5 1.5L9.5 1L10 3L12 4L11 6L12 8L10 9L9.5 11L7.5 10.5L6 12L4.5 10.5L2.5 11L2 9L0 8L1 6L0 4L2 3L2.5 1L4.5 1.5L6 0Z"/>
                <path d="M4 6l1.5 1.5L8 4.5" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round"/>
              </svg>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug mb-2">
          {product.title}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[1,2,3,4,5].map(star => (
                <svg
                  key={star}
                  className={`w-3 h-3 ${star <= Math.round(product.rating!) ? 'text-amber-400' : 'text-gray-200'}`}
                  viewBox="0 0 12 12" fill="currentColor"
                >
                  <path d="M6 0l1.5 3.5 3.5.5-2.5 2.5.5 3.5L6 8.5 3 10l.5-3.5L1 4l3.5-.5L6 0z"/>
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {product.rating.toFixed(1)} ({product.review_count ?? 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-base font-bold text-gray-900">
            {formatUSD(product.price_usd)}
          </span>
          {product.min_order_qty > 1 && (
            <span className="text-xs text-gray-400">/ {product.unit}</span>
          )}
        </div>
        <div className="text-xs text-gray-400 mb-3">
          ≈ {formatUGX(ugxPrice)} · Min {product.min_order_qty} {product.unit}
        </div>

        {/* Origin */}
        {product.origin_country && (
          <div className="flex items-center gap-1 mb-3">
            <span className="text-xs text-gray-400">Ships from</span>
            <span className="text-xs font-medium text-gray-600">{product.origin_country}</span>
          </div>
        )}

        {/* Add to cart */}
        {onAddToCart && (
          <button
            onClick={handleAddToCart}
            disabled={product.stock_qty === 0}
            className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${addedToCart
                ? 'bg-green-500 text-white'
                : product.stock_qty === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]'
              }`}
          >
            {addedToCart ? '✓ Added' : product.stock_qty === 0 ? 'Out of stock' : 'Add to cart'}
          </button>
        )}
      </div>
    </Link>
  );
}

// ─── Skeleton loader ──────────────────────────────────────

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-24" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-5 bg-gray-100 rounded w-20 mt-3" />
        <div className="h-8 bg-gray-100 rounded w-full mt-2" />
      </div>
    </div>
  );
}
