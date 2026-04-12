'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { SearchBar } from '@/components/marketplace/search-bar';
import { FOOD_CROPS, CROP_PRODUCT_TYPES } from '@/lib/constants';

export default function FoodCropsPage() {
  const [activeType, setActiveType] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero banner */}
      <div
        className="relative py-20 px-6 text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #451a03 0%, #92400e 50%, #d97706 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={[{ label: 'Food Crops' }]} />
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">🌾</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-black">Food Crops</h1>
              <p className="text-amber-200 mt-1 text-lg max-w-2xl">
                Maize, wheat, rice, cassava, beans and 15+ staple crops. Buy seeds, medicines,
                fresh harvest or processed — from verified farmers worldwide.
              </p>
            </div>
          </div>
          <div className="mt-6 max-w-xl">
            <SearchBar placeholder="Search maize seeds, rice varieties, cassava..." />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* What are you looking for? */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            What are you looking for?
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveType(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                !activeType
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'border-gray-200 dark:border-gray-700 hover:border-amber-400'
              }`}
            >
              All
            </button>
            {CROP_PRODUCT_TYPES.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setActiveType(activeType === t.value ? null : t.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all flex items-center gap-2 ${
                  activeType === t.value
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'border-gray-200 dark:border-gray-700 hover:border-amber-400'
                }`}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Crop grid */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Select a Crop
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {FOOD_CROPS.map(crop => (
            <Link
              key={crop.value}
              href={`/sector/food_crops/${crop.value}${activeType ? `?type=${activeType}` : ''}`}
              className="group bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-2xl p-5 text-center hover:border-amber-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-5xl mb-3">{crop.icon}</div>
              <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors">
                {crop.label}
              </p>
              <p className="text-xs text-gray-400 mt-1">View all products →</p>
            </Link>
          ))}
        </div>

        {/* Info tip */}
        <div className="mt-12 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
          <p className="font-bold text-amber-800 dark:text-amber-300 mb-2">💡 How it works</p>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Click any crop above to see all available products for that crop — including seeds from
            different countries, pesticides, fungicides, herbicides, fertilizers, fresh produce,
            processed goods, expert agronomist services, and farming equipment. Filter by source
            country to find suppliers near you or in a specific region.
          </p>
        </div>
      </div>
    </div>
  );
}
