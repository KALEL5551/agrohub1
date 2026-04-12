'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Star, MapPin, ShieldCheck } from 'lucide-react';
import { AGRO_SECTORS } from '@/lib/constants';
import { getProductImageUrl } from '@/lib/utils';
import { useCurrency } from '@/hooks/use-currency';
import type { Product } from '@/types';

interface FeaturedSectionProps {
  products: Product[];
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { displayPrice } = useCurrency();

  const sector = AGRO_SECTORS.find(s => s.value === product.category);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.6s ease ${index * 100}ms, transform 0.6s ease ${index * 100}ms`,
      }}
    >
      <Link href={`/products/${product.id}`}>
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
            {product.images?.[0] ? (
              <Image
                src={getProductImageUrl(product.images[0])}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-5xl">
                {sector?.icon || '🌿'}
              </div>
            )}

            {/* Sector badge */}
            <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {sector?.icon} {sector?.label}
            </div>

            {/* Featured badge */}
            {product.is_featured && (
              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Featured
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-green-600 transition-colors mb-1">
              {product.title}
            </h3>

            <div className="flex items-center justify-between mt-3">
              <div>
                <div className="text-green-600 dark:text-green-400 font-black text-lg">
                  {displayPrice(product.price, product.currency)}
                </div>
                <div className="text-xs text-gray-400">per {product.unit}</div>
              </div>

              {product.supplier && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  {product.supplier.is_verified && <ShieldCheck className="h-3 w-3 text-green-500" />}
                  <MapPin className="h-3 w-3" />
                  {product.origin_country}
                </div>
              )}
            </div>

            {product.rating > 0 && (
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                  />
                ))}
                <span className="text-xs text-gray-400 ml-1">({product.total_reviews})</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export function FeaturedSection({ products }: FeaturedSectionProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.2 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div
          ref={headerRef}
          className="flex items-end justify-between mb-12"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <div>
            <p className="text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-widest mb-2">
              Handpicked for you
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
              Featured Products
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400 hover:gap-3 transition-all"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="text-center mt-10 md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400"
          >
            View all products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
