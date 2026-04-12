'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { SearchBar } from '@/components/marketplace/search-bar';
import { LIVESTOCK_TYPES, LIVESTOCK_PRODUCT_TYPES } from '@/lib/constants';

export default function LivestockPage() {
  const [activeType, setActiveType] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div
        className="relative py-20 px-6 text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1c0a00 0%, #7c2d12 50%, #c2410c 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={[{ label: 'Livestock' }]} />
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">🐄</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-black">Livestock</h1>
              <p className="text-orange-200 mt-1 text-lg max-w-2xl">
                Cattle, goats, sheep, pigs, poultry and more. Buy live animals, meat, wool, hides,
                eggs, dairy, veterinary medicines and breeding stock from verified farms globally.
              </p>
            </div>
          </div>
          <div className="mt-6 max-w-xl">
            <SearchBar placeholder="Search cattle breeds, goat meat, sheep wool..." />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What are you looking for?</h2>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setActiveType(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${!activeType ? 'bg-orange-700 text-white border-orange-700' : 'border-gray-200 hover:border-orange-400'}`}>
              All
            </button>
            {LIVESTOCK_PRODUCT_TYPES.map(t => (
              <button key={t.value} type="button" onClick={() => setActiveType(activeType === t.value ? null : t.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all flex items-center gap-2 ${activeType === t.value ? 'bg-orange-700 text-white border-orange-700' : 'border-gray-200 hover:border-orange-400'}`}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Select an Animal</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {LIVESTOCK_TYPES.map(animal => (
            <Link key={animal.value} href={`/sector/livestock/${animal.value}${activeType ? `?type=${activeType}` : ''}`}
              className="group bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900 rounded-2xl p-5 text-center hover:border-orange-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="text-5xl mb-3">{animal.icon}</div>
              <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-orange-600">{animal.label}</p>
              <p className="text-xs text-gray-400 mt-1">View all products →</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 rounded-2xl p-6">
          <p className="font-bold text-orange-800 dark:text-orange-300 mb-2">💡 How it works</p>
          <p className="text-sm text-orange-700 dark:text-orange-400">
            Click any animal to browse live animals, meat cuts, hides & leather, wool, eggs, raw milk,
            animal feed, veterinary medicines, and breeding stock — all filterable by source country.
          </p>
        </div>
      </div>
    </div>
  );
}
