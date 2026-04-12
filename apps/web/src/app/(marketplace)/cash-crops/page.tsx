'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { SearchBar } from '@/components/marketplace/search-bar';
import { CASH_CROPS, CROP_PRODUCT_TYPES } from '@/lib/constants';

export default function CashCropsPage() {
  const [activeType, setActiveType] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div
        className="relative py-20 px-6 text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #16a34a 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={[{ label: 'Cash Crops' }]} />
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">🌿</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-black">Cash Crops</h1>
              <p className="text-green-200 mt-1 text-lg max-w-2xl">
                Coffee, cocoa, cotton, rubber, vanilla and 10+ high-value export crops.
                Seeds, medicines, bulk harvest — sourced from verified farms globally.
              </p>
            </div>
          </div>
          <div className="mt-6 max-w-xl">
            <SearchBar placeholder="Search coffee beans, cocoa, vanilla seeds..." />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What are you looking for?</h2>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setActiveType(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${!activeType ? 'bg-green-700 text-white border-green-700' : 'border-gray-200 hover:border-green-400'}`}>
              All
            </button>
            {CROP_PRODUCT_TYPES.map(t => (
              <button key={t.value} type="button" onClick={() => setActiveType(activeType === t.value ? null : t.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all flex items-center gap-2 ${activeType === t.value ? 'bg-green-700 text-white border-green-700' : 'border-gray-200 hover:border-green-400'}`}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Select a Crop</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {CASH_CROPS.map(crop => (
            <Link key={crop.value} href={`/sector/cash_crops/${crop.value}${activeType ? `?type=${activeType}` : ''}`}
              className="group bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900 rounded-2xl p-5 text-center hover:border-green-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="text-5xl mb-3">{crop.icon}</div>
              <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-green-600">{crop.label}</p>
              <p className="text-xs text-gray-400 mt-1">View all products →</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-2xl p-6">
          <p className="font-bold text-green-800 dark:text-green-300 mb-2">💡 How it works</p>
          <p className="text-sm text-green-700 dark:text-green-400">
            Click any crop to see seeds, medicines (pesticides, fungicides, herbicides), fertilizers,
            bulk harvest, expert agronomist services and equipment — all filterable by source country.
          </p>
        </div>
      </div>
    </div>
  );
}
