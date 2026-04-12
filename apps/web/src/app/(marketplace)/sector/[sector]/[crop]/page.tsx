'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { ProductGrid } from '@/components/marketplace/product-grid';
import { Card, Button, Badge } from '@/components/ui';
import { useProducts } from '@/hooks/use-products';
import { AgroAdvisor } from '@/components/ai/agro-advisor';
import {
  AGRO_SECTORS, AGRICULTURE_SUBCATEGORIES,
  CROP_PRODUCT_TYPES, LIVESTOCK_PRODUCT_TYPES, FISH_PRODUCT_TYPES,
  WORLD_COUNTRIES,
} from '@/lib/constants';

// Color themes per sector
const SECTOR_THEME: Record<string, { gradient: string; accent: string; light: string }> = {
  cash_crops:       { gradient: 'from-[#052e16] to-[#16a34a]', accent: 'bg-green-700',   light: 'bg-green-50 dark:bg-green-950/30 border-green-200' },
  food_crops:       { gradient: 'from-[#451a03] to-[#d97706]', accent: 'bg-amber-700',   light: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200' },
  vegetables:       { gradient: 'from-[#052e16] to-[#4ade80]', accent: 'bg-lime-700',    light: 'bg-lime-50  dark:bg-lime-950/30  border-lime-200' },
  fruits:           { gradient: 'from-[#3b0a0a] to-[#ef4444]', accent: 'bg-red-700',     light: 'bg-red-50   dark:bg-red-950/30   border-red-200' },
  livestock:        { gradient: 'from-[#1c0a00] to-[#c2410c]', accent: 'bg-orange-700',  light: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200' },
  poultry:          { gradient: 'from-[#1c0a00] to-[#ca8a04]', accent: 'bg-yellow-700',  light: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200' },
  fisheries:        { gradient: 'from-[#0c1445] to-[#2563eb]', accent: 'bg-blue-700',    light: 'bg-blue-50  dark:bg-blue-950/30  border-blue-200' },
  coffee_beverages: { gradient: 'from-[#1a0800] to-[#7c2d12]', accent: 'bg-amber-900',   light: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200' },
  spices_herbs:     { gradient: 'from-[#3b0a0a] to-[#dc2626]', accent: 'bg-rose-700',    light: 'bg-rose-50  dark:bg-rose-950/30  border-rose-200' },
};

export default function CropDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sectorId = params.sector as string;
  const cropId   = params.crop as string;

  const sector = AGRO_SECTORS.find(s => s.value === sectorId);
  const crop   = AGRICULTURE_SUBCATEGORIES.find(c => c.value === cropId);

  const isLivestock = ['livestock', 'poultry'].includes(sectorId);
  const isFish      = sectorId === 'fisheries';
  const subtypes    = isLivestock ? LIVESTOCK_PRODUCT_TYPES : isFish ? FISH_PRODUCT_TYPES : CROP_PRODUCT_TYPES;

  const [activeType,    setActiveType]    = useState<string>(searchParams.get('type') || '');
  const [countryFilter, setCountryFilter] = useState('');
  const [showAdvisor,   setShowAdvisor]   = useState(false);

  const { products, isLoading } = useProducts({ subcategory: cropId });

  if (!sector || !crop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🌿</p>
          <h1 className="text-2xl font-bold mb-2">Crop not found</h1>
          <Link href="/products" className="text-green-600 hover:underline">Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  const theme = SECTOR_THEME[sectorId] ?? SECTOR_THEME.cash_crops;

  // Filter products by type and country
  const filtered = products.filter(p => {
    const matchType    = !activeType    || (p as Record<string, unknown>).product_type === activeType;
    const matchCountry = !countryFilter || p.origin_country === countryFilter;
    return matchType && matchCountry;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">

      {/* ── HERO BANNER ── */}
      <div className={`relative py-16 px-6 text-white bg-gradient-to-r ${theme.gradient}`}>
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={[
            { label: sector.label, href: `/${sectorId.replace('_', '-')}` },
            { label: crop.label },
          ]} />
          <div className="flex items-center gap-4 mb-3">
            <span className="text-7xl">{crop.icon}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-black">{crop.label}</h1>
              <p className="text-white/70 mt-1 text-lg">
                Seeds · Medicines · Fresh Produce · Expert Services · Equipment
              </p>
            </div>
          </div>

          {/* AI Advisor toggle */}
          <button
            type="button"
            onClick={() => setShowAdvisor(!showAdvisor)}
            className="mt-4 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
          >
            🤖 {showAdvisor ? 'Hide' : 'Ask'} AI Agro Advisor about {crop.label}
          </button>
        </div>
      </div>

      {/* ── AI ADVISOR PANEL ── */}
      {showAdvisor && (
        <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <AgroAdvisor cropName={crop.label} sectorName={sector.label} />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-4 gap-8">

          {/* ── SIDEBAR ── */}
          <aside className="space-y-6">

            {/* Product type filter */}
            <div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-3">
                Product Type
              </h3>
              <div className="space-y-1">
                <button type="button" onClick={() => setActiveType('')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${!activeType ? `${theme.accent} text-white` : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  🌐 All Types
                </button>
                {subtypes.map(t => (
                  <button key={t.value} type="button" onClick={() => setActiveType(t.value === activeType ? '' : t.value)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${activeType === t.value ? `${theme.accent} text-white` : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                    <span className="text-base">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Country filter */}
            <div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-3">
                Source Country
              </h3>
              <select
                value={countryFilter}
                onChange={e => setCountryFilter(e.target.value)}
                className="w-full h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm"
              >
                <option value="">All Countries</option>
                {WORLD_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Sell here CTA */}
            <div className={`rounded-2xl border p-4 ${theme.light}`}>
              <p className="font-bold text-sm mb-1">Are you a seller?</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                List your {crop.label} products — seeds, medicines, produce, services.
              </p>
              <Link href={`/listings/new?subcategory=${cropId}&sector=${sectorId}`}>
                <Button size="sm" className="w-full">+ List a Product</Button>
              </Link>
            </div>

            {/* Medicine tip */}
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-yellow-800 dark:text-yellow-300 mb-2">💊 Medicine Guide</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-400">
                Filter by <strong>Pesticides</strong>, <strong>Fungicides</strong> or{' '}
                <strong>Herbicides</strong> then select a source country to find
                suppliers of {crop.label} treatments near you.
              </p>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <div className="lg:col-span-3">

            {/* Active type tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button type="button" onClick={() => setActiveType('')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${!activeType ? `${theme.accent} text-white` : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                All
              </button>
              {subtypes.map(t => (
                <button key={t.value} type="button" onClick={() => setActiveType(t.value === activeType ? '' : t.value)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-all ${activeType === t.value ? `${theme.accent} text-white` : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* Active filters display */}
            {(activeType || countryFilter) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeType && (
                  <Badge variant="muted">
                    Type: {subtypes.find(t => t.value === activeType)?.label}
                    <button type="button" className="ml-1 hover:text-red-500" onClick={() => setActiveType('')}>×</button>
                  </Badge>
                )}
                {countryFilter && (
                  <Badge variant="muted">
                    Country: {countryFilter}
                    <button type="button" className="ml-1 hover:text-red-500" onClick={() => setCountryFilter('')}>×</button>
                  </Badge>
                )}
              </div>
            )}

            {/* Results count */}
            <p className="text-sm text-gray-400 mb-4">
              {isLoading ? 'Loading...' : `${filtered.length} products found`}
              {countryFilter && ` from ${countryFilter}`}
            </p>

            {/* Product grid */}
            <ProductGrid products={filtered} isLoading={isLoading}
              emptyMessage={`No ${activeType ? subtypes.find(t=>t.value===activeType)?.label : ''} products found for ${crop.label}${countryFilter ? ` from ${countryFilter}` : ''}. Try removing filters or be the first to list!`}
            />

            {/* Be first to list */}
            {!isLoading && filtered.length === 0 && (
              <div className="mt-6 text-center">
                <Link href={`/listings/new?subcategory=${cropId}&sector=${sectorId}${activeType ? `&product_type=${activeType}` : ''}`}>
                  <Button size="lg">+ Be the First to List {crop.label} {activeType ? subtypes.find(t=>t.value===activeType)?.label : 'Products'}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
