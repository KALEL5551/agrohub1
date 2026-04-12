'use client';

import { useEffect, useRef, useState } from 'react';

interface StatsBarProps {
  products: number;
  suppliers: number;
  countries: number;
}

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setValue(target);
              clearInterval(timer);
            } else {
              setValue(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {value.toLocaleString()}{suffix}
    </span>
  );
}

const STATS = [
  { label: 'Products Listed',     icon: '🌾', getValue: (s: StatsBarProps) => s.products,   suffix: '+' },
  { label: 'Verified Suppliers',  icon: '✅', getValue: (s: StatsBarProps) => s.suppliers,  suffix: '+' },
  { label: 'Countries',           icon: '🌍', getValue: (s: StatsBarProps) => s.countries,  suffix: '+' },
  { label: 'Crop Varieties',      icon: '🌱', getValue: () => 120,                           suffix: '+' },
  { label: 'Payment Methods',     icon: '💳', getValue: () => 8,                             suffix: '' },
  { label: 'Escrow Protected',    icon: '🔒', getValue: () => 100,                           suffix: '%' },
];

export function StatsBar(props: StatsBarProps) {
  return (
    <section className="relative z-10 -mt-1 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl md:text-2xl font-black text-green-700 dark:text-green-400 leading-none">
                <AnimatedNumber target={stat.getValue(props)} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
