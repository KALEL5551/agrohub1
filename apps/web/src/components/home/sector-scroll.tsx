'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Sector { value: string; label: string; icon: string; description: string; }

const COLORS: Record<string, string> = {
  cash_crops: '#f0fdf4', food_crops: '#fffbeb', vegetables: '#f7fee7',
  fruits: '#fef2f2', livestock: '#fff7ed', poultry: '#fefce8',
  fisheries: '#eff6ff', coffee_beverages: '#fdf4ff', spices_herbs: '#fff1f2',
  dairy: '#f0f9ff', honey: '#fffbeb', seeds_nursery: '#f0fdf4',
  farm_inputs: '#faf5ff', farm_equipment: '#f8fafc', agro_processing: '#f9fafb',
};

export function SectorScroll({ sectors }: { sectors: Sector[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: 'left'|'right') =>
    ref.current?.scrollBy({ left: d === 'left' ? -320 : 320, behavior: 'smooth' });

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-green-600 text-xs font-bold uppercase tracking-widest mb-1">Every sector covered</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">Explore Agro Sectors</h2>
          </div>
          <div className="flex gap-2">
            {['left','right'].map(d => (
              <button key={d} type="button" onClick={() => scroll(d as 'left'|'right')}
                className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors">
                {d === 'left' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
        <div ref={ref} className="flex gap-4 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}>
          {sectors.map((s, i) => (
            <Link key={s.value} href={`/sector/${s.value}`}
              className="flex-none w-52 rounded-2xl p-5 border hover:scale-105 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              style={{ scrollSnapAlign: 'start', background: COLORS[s.value] || '#f9fafb',
                animationDelay: `${i * 50}ms` }}>
              <div className="text-4xl mb-3">{s.icon}</div>
              <h3 className="font-bold text-sm text-gray-900 mb-1 group-hover:text-green-600 transition-colors">{s.label}</h3>
              <p className="text-xs text-gray-500 line-clamp-2">{s.description}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/products" className="text-green-600 font-semibold text-sm hover:underline">
            View all products →
          </Link>
        </div>
      </div>
    </section>
  );
}
