'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, ShieldCheck, MapPin, MessageCircle, ShoppingCart, Minus, Plus } from 'lucide-react';
import { Button, Badge, Card } from '@/components/ui';
import { Avatar } from '@/components/ui/avatar';
import { useCart } from '@/hooks/use-cart';
import { formatCurrency, getProductImageUrl } from '@/lib/utils';
import { toast } from 'sonner';
import type { Product } from '@/types';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(product.min_order_quantity);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.title} added to cart`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
          {product.images?.[selectedImage] ? (
            <Image
              src={getProductImageUrl(product.images[selectedImage])}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-6xl">
              {product.category === 'agriculture' ? '🌾' : '🔌'}
            </div>
          )}
        </div>

        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedImage(i)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                  i === selectedImage ? 'border-primary' : 'border-transparent'
                }`}
              >
                <Image
                  src={getProductImageUrl(img)}
                  alt={`${product.title} ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={product.category === 'agriculture' ? 'success' : 'warning'}>
              {product.category === 'agriculture' ? '🌿 Agriculture' : '⚡ Electronics'}
            </Badge>
            <Badge variant="muted">{product.subcategory}</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold">{product.title}</h1>

          {product.rating > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(product.rating)
                        ? 'fill-brand-gold-400 text-brand-gold-400'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({product.total_reviews} reviews)</span>
            </div>
          )}
        </div>

        <div className="p-4 rounded-lg bg-accent">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              {formatCurrency(product.price, product.currency)}
            </span>
            <span className="text-muted-foreground">/ {product.unit}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Min order: {product.min_order_quantity} {product.unit}
            {product.max_order_quantity && ` • Max: ${product.max_order_quantity} ${product.unit}`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => setQuantity(Math.max(product.min_order_quantity, quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(product.min_order_quantity, Number(e.target.value)))
              }
              className="w-20 h-10 rounded-lg border text-center text-sm font-medium"
            />
            <Button variant="outline" size="icon" type="button" onClick={() => setQuantity(quantity + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button size="lg" className="flex-1" type="button" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart — {formatCurrency(product.price * quantity, product.currency)}
          </Button>
        </div>

        {product.supplier && (
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Avatar
                src={product.supplier.avatar_url}
                name={product.supplier.full_name}
                size="lg"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-semibold">
                    {product.supplier.business_name || product.supplier.full_name}
                  </span>
                  {product.supplier.is_verified && (
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {product.supplier.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-brand-gold-400 text-brand-gold-400" />
                    {product.supplier.rating?.toFixed(1) || 'New'}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" type="button">
                <MessageCircle className="mr-1 h-3 w-3" />
                Chat
              </Button>
            </div>
          </Card>
        )}

        <div>
          <h2 className="font-semibold text-lg mb-2">Description</h2>
          <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
            {product.description}
          </p>
        </div>

        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div>
            <h2 className="font-semibold text-lg mb-2">Specifications</h2>
            <div className="border rounded-lg divide-y">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex px-4 py-2.5 text-sm">
                  <span className="font-medium w-1/3 text-muted-foreground">{key}</span>
                  <span className="w-2/3">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="muted">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
