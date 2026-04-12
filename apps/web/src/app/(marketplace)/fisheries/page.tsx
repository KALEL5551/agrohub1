'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { SearchBar } from '@/components/marketplace/search-bar';
import { FISH_TYPES, FISH_PRODUCT_TYPES } from '@/lib/constants';

export default function FisheriesPage() {
  const [activeType, setActiveType] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div
        className="relative py-20 px-6 text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0c1445 0%, #1e3a8a 50%, #2563eb 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={[{ label: 'Fisheries' }]} />
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">🐟</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-black">Fisheries & Aquaculture</h1>
              <p className="text-blue-200 mt-1 text-lg max-w-2xl">
                Tilapia, catfish, salmon, shrimp, dried fish and 10+ species. Fresh, frozen, dried
                or processed — plus fish feed, medicines, fingerlings and aquaculture equipment.
              </p>
            </div>
          </div>
          <div className="mt-6 max-w-xl">
            <SearchBar placeholder="Search tilapia, shrimp, dried fish, fingerlings..." />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What are you looking for?</h2>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setActiveType(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${!activeType ? 'bg-blue-700 text-white border-blue-700' : 'border-gray-200 hover:border-blue-400'}`}>
              All
            </button>
            {FISH_PRODUCT_TYPES.map(t => (
              <button key={t.value} type="button" onClick={() => setActiveType(activeType === t.value ? null : t.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all flex items-center gap-2 ${activeType === t.value ? 'bg-blue-700 text-white border-blue-700' : 'border-gray-200 hover:border-blue-400'}`}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Select a Species</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {FISH_TYPES.map(fish => (
            <Link key={fish.value} href={`/sector/fisheries/${fish.value}${activeType ? `?type=${activeType}` : ''}`}
              className="group bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-2xl p-5 text-center hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="text-5xl mb-3">{fish.icon}</div>
              <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600">{fish.label}</p>
              <p className="text-xs text-gray-400 mt-1">View all products →</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-2xl p-6">
          <p className="font-bold text-blue-800 dark:text-blue-300 mb-2">💡 How it works</p>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Click any species to see live fish, fresh/chilled, frozen, dried/smoked, canned, fish feed,
            disease treatment medicines, fingerlings & fry, and aquaculture equipment — filter by country.
          </p>
        </div>
      </div>
    </div>
  );
}
