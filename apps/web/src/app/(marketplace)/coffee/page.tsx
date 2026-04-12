'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { SearchBar } from '@/components/marketplace/search-bar';
import { COFFEE_TYPES, SPICES, CROP_PRODUCT_TYPES } from '@/lib/constants';

export default function CoffeePage() {
  const [activeType, setActiveType] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div
        className="relative py-20 px-6 text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0800 0%, #431407 50%, #7c2d12 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={[{ label: 'Coffee & More' }]} />
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">☕</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-black">Coffee & Beverages</h1>
              <p className="text-amber-200 mt-1 text-lg max-w-2xl">
                Arabica, Robusta, specialty blends, tea, cocoa and more. Green beans, roasted,
                instant — sourced directly from coffee-growing regions worldwide.
              </p>
            </div>
          </div>
          <div className="mt-6 max-w-xl">
            <SearchBar placeholder="Search arabica green beans, black tea, cocoa powder..." />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What are you looking for?</h2>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setActiveType(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${!activeType ? 'bg-amber-800 text-white border-amber-800' : 'border-gray-200 hover:border-amber-500'}`}>
              All
            </button>
            {CROP_PRODUCT_TYPES.map(t => (
              <button key={t.value} type="button" onClick={() => setActiveType(activeType === t.value ? null : t.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all flex items-center gap-2 ${activeType === t.value ? 'bg-amber-800 text-white border-amber-800' : 'border-gray-200 hover:border-amber-500'}`}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Coffee & Beverages</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
          {COFFEE_TYPES.map(item => (
            <Link key={item.value} href={`/sector/coffee_beverages/${item.value}${activeType ? `?type=${activeType}` : ''}`}
              className="group bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-2xl p-5 text-center hover:border-amber-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="text-5xl mb-3">{item.icon}</div>
              <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-amber-700">{item.label}</p>
              <p className="text-xs text-gray-400 mt-1">View all products →</p>
            </Link>
          ))}
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Spices & Herbs</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {SPICES.map(item => (
            <Link key={item.value} href={`/sector/spices_herbs/${item.value}${activeType ? `?type=${activeType}` : ''}`}
              className="group bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-2xl p-5 text-center hover:border-red-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="text-5xl mb-3">{item.icon}</div>
              <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-red-600">{item.label}</p>
              <p className="text-xs text-gray-400 mt-1">View all products →</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
