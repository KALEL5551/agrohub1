import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, ShieldCheck } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { formatCurrency, getProductImageUrl } from '@/lib/utils';
import { AGRO_SECTORS } from '@/lib/constants';
import type { Product } from '@/types/database';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const sector = AGRO_SECTORS.find(s => s.value === product.category);

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {product.images?.[0] ? (
            <Image
              src={getProductImageUrl(product.images[0])}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-5xl">
              {sector?.icon || '🌿'}
            </div>
          )}
          <Badge variant="success" className="absolute top-3 left-3 text-xs">
            {sector?.icon} {sector?.label || 'Agriculture'}
          </Badge>
          {product.is_featured && (
            <Badge variant="secondary" className="absolute top-3 right-3">Featured</Badge>
          )}
          {/* B2B / B2C badge */}
          {(product as Product & { trade_type?: string }).trade_type && (
            <span className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              {(product as Product & { trade_type?: string }).trade_type}
            </span>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {product.subcategory} • Min: {product.min_order_quantity} {product.unit}
          </p>

          <div className="mt-auto pt-3 space-y-2">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-primary">
                {formatCurrency(product.price, product.currency)}
              </span>
              <span className="text-xs text-muted-foreground">/{product.unit}</span>
            </div>

            {product.supplier && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  {product.supplier.is_verified && <ShieldCheck className="h-3 w-3 text-primary" />}
                  <span className="truncate max-w-[100px]">
                    {product.supplier.business_name || product.supplier.full_name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{product.origin_country}</span>
                </div>
              </div>
            )}

            {product.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-brand-gold-400 text-brand-gold-400" />
                <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({product.total_reviews})</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
