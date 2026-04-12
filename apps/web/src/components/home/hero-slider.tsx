'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SLIDES = [
  {
    id: 1,
    headline: 'Trade Agriculture',
    highlight: 'With the World',
    sub: 'Connect with verified farmers and agro-dealers across 100+ countries. Seeds, medicine, livestock, fish and more.',
    cta: 'Browse Marketplace',
    ctaHref: '/products',
    badge: '🌍 Global Agricultural Marketplace',
    bg: 'from-[#041f04] via-[#0a3d0a] to-[#1a6b1a]',
    accent: '#4ade80',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80',
    stat: '50,000+ products listed',
  },
  {
    id: 2,
    headline: 'Fresh From the Farm',
    highlight: 'To Your Door',
    sub: 'Order directly from smallholder farmers worldwide. Escrow-protected payments in your local currency.',
    cta: 'Shop Food Crops',
    ctaHref: '/sector/food_crops',
    badge: '🌾 Food Crops & Fresh Produce',
    bg: 'from-[#1a0a00] via-[#5c1f00] to-[#b84500]',
    accent: '#fb923c',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&q=80',
    stat: '120+ crop varieties',
  },
  {
    id: 3,
    headline: 'Premium Livestock',
    highlight: 'Verified Breeders',
    sub: 'Cattle, goats, sheep, poultry and more. Live animals, meat, wool, hides — sourced from verified farms globally.',
    cta: 'Explore Livestock',
    ctaHref: '/sector/livestock',
    badge: '🐄 Livestock & Animal Products',
    bg: 'from-[#0a0a1a] via-[#1a1a4a] to-[#2d2d8a]',
    accent: '#818cf8',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&q=80',
    stat: '15 animal categories',
  },
  {
    id: 4,
    headline: 'World-Class Coffee',
    highlight: '& Beverages',
    sub: 'Arabica, Robusta, specialty blends. Source directly from coffee-growing regions across Africa, Asia, and Latin America.',
    cta: 'Source Coffee',
    ctaHref: '/sector/coffee_beverages',
    badge: '☕ Coffee & Beverages',
    bg: 'from-[#1a0a00] via-[#3d1a00] to-[#6b3300]',
    accent: '#fbbf24',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600&q=80',
    stat: '12 coffee & tea types',
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length);
  }, [current, goTo]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[current];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">

      {/* Background image */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0, zIndex: 0 }}
        >
          <img
            src={s.image}
            alt={s.headline}
            className="w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          {/* Dark gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${s.bg} opacity-80`} />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div
          key={current}
          className="max-w-3xl"
          style={{
            animation: 'slideUp 0.6s ease-out forwards',
          }}
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm"
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: `1px solid ${slide.accent}40`,
              color: slide.accent,
            }}
          >
            {slide.badge}
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.0] mb-2 tracking-tight">
            {slide.headline}
          </h1>
          <h1
            className="text-5xl md:text-7xl font-black leading-[1.0] mb-6 tracking-tight"
            style={{ color: slide.accent }}
          >
            {slide.highlight}
          </h1>

          {/* Subtext */}
          <p className="text-white/75 text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
            {slide.sub}
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-xl">
            <div className="flex-1 flex items-center gap-3 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-5 py-3">
              <Search className="h-4 w-4 text-white/60 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tomato seeds, arabica coffee..."
                className="bg-transparent text-white placeholder:text-white/50 text-sm w-full outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-full font-bold text-sm text-white transition-all hover:scale-105 active:scale-95"
              style={{ background: slide.accent, color: '#000' }}
            >
              Search
            </button>
          </form>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 items-center">
            <Link
              href={slide.ctaHref}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105 active:scale-95"
              style={{ background: slide.accent, color: '#000' }}
            >
              {slide.cta} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white border-2 border-white/30 hover:bg-white/10 transition-all"
            >
              Join Free
            </Link>
            <span className="text-white/50 text-sm hidden sm:block">• {slide.stat}</span>
          </div>
        </div>
      </div>

      {/* Slide navigation arrows */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white/25 transition-all"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white/25 transition-all"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Slide dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            className="transition-all duration-300"
            style={{
              width: i === current ? '32px' : '8px',
              height: '8px',
              borderRadius: '999px',
              background: i === current ? slide.accent : 'rgba(255,255,255,0.4)',
            }}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-8 z-20 text-white/50 text-sm font-mono">
        {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
