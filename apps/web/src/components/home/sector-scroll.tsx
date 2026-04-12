'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Sector {
  value: string;
  label: string;
  icon: string;
  description: string;
}

interface SectorScrollProps {
  sectors: Sector[];
}

const SECTOR_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  cash_crops:       { bg: 'bg-green-50  dark:bg-green-950',  border: 'border-green-200 dark:border-green-800',  text: 'text-green-700 dark:text-green-300' },
  food_crops:       { bg: 'bg-amber-50  dark:bg-amber-950',  border: 'border-amber-200 dark:border-amber-800',  text: 'text-amber-700 dark:text-amber-300' },
  vegetables:       { bg: 'bg-lime-50   dark:bg-lime-950',   border: 'border-lime-200  dark:border-lime-800',   text: 'text-lime-700  dark:text-lime-300' },
  fruits:           { bg: 'bg-red-50    dark:bg-red-950',    border: 'border-red-200   dark:border-red-800',    text: 'text-red-700   dark:text-red-300' },
  livestock:        { bg: 'bg-orange-50 dark:bg-orange-950', border: 'border-orange-200 dark:border-orange-800',text: 'text-orange-700 dark:text-orange-300' },
  poultry:          { bg: 'bg-yellow-50 dark:bg-yellow-950', border: 'border-yellow-200 dark:border-yellow-800',text: 'text-yellow-700 dark:text-yellow-300' },
  fisheries:        { bg: 'bg-blue-50   dark:bg-blue-950',   border: 'border-blue-200  dark:border-blue-800',   text: 'text-blue-700  dark:text-blue-300' },
  coffee_beverages: { bg: 'bg-stone-50  dark:bg-stone-950',  border: 'border-stone-200 dark:border-stone-800',  text: 'text-stone-700 dark:text-stone-300' },
  spices_herbs:     { bg: 'bg-rose-50   dark:bg-rose-950',   border: 'border-rose-200  dark:border-rose-800',   text: 'text-rose-700  dark:text-rose-300' },
  dairy:            { bg: 'bg-sky-50    dark:bg-sky-950',    border: 'border-sky-200   dark:border-sky-800',    text: 'text-sky-700   dark:text-sky-300' },
  honey:            { bg: 'bg-amber-50  dark:bg-amber-950',  border: 'border-amber-200 dark:border-amber-800',  text: 'text-amber-600 dark:text-amber-400' },
  seeds_nursery:    { bg: 'bg-emerald-50 dark:bg-emerald-950',border:'border-emerald-200 dark:border-emerald-800',text:'text-emerald-700 dark:text-emerald-300' },
  farm_inputs:      { bg: 'bg-violet-50 dark:bg-violet-950', border: 'border-violet-200 dark:border-violet-800',text: 'text-violet-700 dark:text-violet-300' },
  farm_equipment:   { bg: 'bg-slate-50  dark:bg-slate-950',  border: 'border-slate-200 dark:border-slate-800',  text: 'text-slate-700 dark:text-slate-300' },
  agro_processing:  { bg: 'bg-gray-50   dark:bg-gray-900',   border: 'border-gray-200  dark:border-gray-700',   text: 'text-gray-700  dark:text-gray-300' },
};

export function SectorScroll({ sectors }: SectorScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-widest mb-2">
              Every sector covered
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
              Explore Agro Sectors
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable strip */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {sectors.map((sector, i) => {
            const colors = SECTOR_COLORS[sector.value] ?? SECTOR_COLORS.cash_crops;
            return (
              <Link
                key={sector.value}
                href={`/sector/${sector.value}`}
                className={`
                  flex-none w-52 snap-start rounded-2xl border p-5
                  ${colors.bg} ${colors.border}
                  hover:scale-105 hover:shadow-lg transition-all duration-300 group
                `}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="text-4xl mb-3">{sector.icon}</div>
                <h3 className={`font-bold text-sm mb-1 ${colors.text} group-hover:underline`}>
                  {sector.label}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">
                  {sector.description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* View all link */}
        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm hover:gap-3 transition-all"
          >
            View all products <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
