'use client';
import { useEffect, useRef, useState } from 'react';

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let cur = 0;
        const step = target / 60;
        const t = setInterval(() => {
          cur += step;
          if (cur >= target) { setValue(target); clearInterval(t); }
          else setValue(Math.floor(cur));
        }, 30);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
}

const STATS = [
  { label: 'Products Listed',    icon: '🌾', value: 50000, suffix: '+' },
  { label: 'Verified Suppliers', icon: '✅', value: 2000,  suffix: '+' },
  { label: 'Countries',          icon: '🌍', value: 100,   suffix: '+' },
  { label: 'Crop Varieties',     icon: '🌱', value: 120,   suffix: '+' },
  { label: 'Payment Methods',    icon: '💳', value: 8,     suffix: '' },
  { label: 'Escrow Protected',   icon: '🔒', value: 100,   suffix: '%' },
];

export function StatsBar() {
  return (
    <section className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 py-5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl md:text-2xl font-black text-green-700 dark:text-green-400">
                <AnimatedNumber target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
