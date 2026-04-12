'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { Card } from '@/components/ui';
import {
  AGRO_SECTORS, CASH_CROPS, FOOD_CROPS, VEGETABLES, FRUITS,
  LIVESTOCK_TYPES, FISH_TYPES, COFFEE_TYPES, SPICES,
  CROP_PRODUCT_TYPES, LIVESTOCK_PRODUCT_TYPES, FISH_PRODUCT_TYPES,
} from '@/lib/constants';

const SECTOR_ITEMS: Record<string, Array<{ value: string; label: string; icon: string }>> = {
  cash_crops:       CASH_CROPS,
  food_crops:       FOOD_CROPS,
  vegetables:       VEGETABLES,
  fruits:           FRUITS,
  livestock:        LIVESTOCK_TYPES,
  poultry:          LIVESTOCK_TYPES.filter(l => ['chicken','turkey','duck','guinea_fowl','ostrich'].includes(l.value)),
  fisheries:        FISH_TYPES,
  coffee_beverages: COFFEE_TYPES,
  spices_herbs:     SPICES,
};

const SECTOR_THEME: Record<string, string> = {
  cash_crops: 'from-[#052e16] to-[#16a34a]',
  food_crops: 'from-[#451a03] to-[#d97706]',
  vegetables: 'from-[#052e16] to-[#4ade80]',
  fruits:     'from-[#3b0a0a] to-[#ef4444]',
  livestock:  'from-[#1c0a00] to-[#c2410c]',
  fisheries:  'from-[#0c1445] to-[#2563eb]',
  coffee_beverages: 'from-[#1a0800] to-[#7c2d12]',
  spices_herbs: 'from-[#3b0a0a] to-[#dc2626]',
};

export default function SectorPage() {
  const params   = useParams();
  const sectorId = params.sector as string;
  const sector   = AGRO_SECTORS.find(s => s.value === sectorId);
  const items    = SECTOR_ITEMS[sectorId] || [];

  const isLivestock = ['livestock','poultry'].includes(sectorId);
  const isFish      = sectorId === 'fisheries';
  const subtypes    = isLivestock ? LIVESTOCK_PRODUCT_TYPES : isFish ? FISH_PRODUCT_TYPES : CROP_PRODUCT_TYPES;
  const gradient    = SECTOR_THEME[sectorId] ?? 'from-green-900 to-green-600';

  if (!sector) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🌿</p>
          <h1 className="text-2xl font-bold">Sector not found</h1>
          <Link href="/products" className="text-green-600 hover:underline mt-4 block">Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className={`relative py-20 px-6 text-white bg-gradient-to-r ${gradient}`}>
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={[{ label: sector.label }]} />
          <div className="flex items-center gap-4">
            <span className="text-7xl">{sector.icon}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-black">{sector.label}</h1>
              <p className="text-white/70 mt-2 text-lg max-w-2xl">{sector.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {items.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
              Select a {isFish ? 'Species' : isLivestock ? 'Animal' : 'Crop'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map(item => (
                <Link key={item.value} href={`/sector/${sectorId}/${item.value}`}>
                  <Card className="group p-5 text-center hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center gap-3">
                    <span className="text-5xl">{item.icon}</span>
                    <p className="font-bold text-sm group-hover:text-primary transition-colors">{item.label}</p>
                    <p className="text-xs text-gray-400">Seeds · Medicine · Produce →</p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
            Browse by Product Type
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {subtypes.map(t => (
              <Link key={t.value} href={`/products?sector=${sectorId}&product_type=${t.value}`}>
                <Card className="p-4 flex items-center gap-3 hover:border-primary hover:shadow-sm transition-all cursor-pointer">
                  <span className="text-2xl">{t.icon}</span>
                  <span className="font-semibold text-sm">{t.label}</span>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
