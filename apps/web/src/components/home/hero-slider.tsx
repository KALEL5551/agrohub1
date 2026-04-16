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
    accent: '#4ade80',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80',
    stat: '50,000+ products listed',
    bg: 'linear-gradient(to right, rgba(4,31,4,0.92), rgba(10,61,10,0.75))',
  },
  {
    id: 2,
    headline: 'Fresh From the Farm',
    highlight: 'To Your Door',
    sub: 'Order directly from smallholder farmers worldwide. Escrow-protected payments in your local currency.',
    cta: 'Shop Food Crops',
    ctaHref: '/food-crops',
    badge: '🌾 Food Crops & Fresh Produce',
    accent: '#fb923c',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&q=80',
    stat: '120+ crop varieties',
    bg: 'linear-gradient(to right, rgba(26,10,0,0.92), rgba(92,31,0,0.75))',
  },
  {
    id: 3,
    headline: 'Premium Livestock',
    highlight: 'Verified Breeders',
    sub: 'Cattle, goats, sheep, poultry and more. Live animals, meat, wool, hides from verified farms globally.',
    cta: 'Explore Livestock',
    ctaHref: '/livestock',
    badge: '🐄 Livestock & Animal Products',
    accent: '#818cf8',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&q=80',
    stat: '15 animal categories',
    bg: 'linear-gradient(to right, rgba(10,10,26,0.92), rgba(29,29,74,0.75))',
  },
  {
    id: 4,
    headline: 'World-Class Coffee',
    highlight: '& Beverages',
    sub: 'Arabica, Robusta, specialty blends. Source directly from coffee-growing regions across the globe.',
    cta: 'Source Coffee',
    ctaHref: '/coffee',
    badge: '☕ Coffee & Beverages',
    accent: '#fbbf24',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600&q=80',
    stat: '12 coffee & tea types',
    bg: 'linear-gradient(to right, rgba(26,8,0,0.92), rgba(61,26,0,0.75))',
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const goTo = useCallback((index: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 400);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[current];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <section className="relative overflow-hidden" style={{ height: 'calc(100vh - 64px)', minHeight: '600px', maxHeight: '900px' }}>

      {/* Background images */}
      {SLIDES.map((s, i) => (
        <div key={s.id} className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0, zIndex: 0 }}>
          <img src={s.image} alt="" className="w-full h-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
          <div className="absolute inset-0" style={{ background: s.bg }} />
          <div className="absolute bottom-0 left-0 right-0 h-32"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 lg:px-24"
        style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div key={current} style={{ animation: 'slideUp 0.6s ease-out forwards' }}>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5"
            style={{ background: 'rgba(255,255,255,0.15)', border: `1px solid ${slide.accent}60`, color: slide.accent }}>
            {slide.badge}
          </div>

          {/* Headline */}
          <h1 className="font-black text-white leading-none tracking-tight mb-2"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}>
            {slide.headline}
          </h1>
          <h1 className="font-black leading-none tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: slide.accent }}>
            {slide.highlight}
          </h1>

          <p className="text-white/75 mb-8 max-w-xl leading-relaxed"
            style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}>
            {slide.sub}
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-xl">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-full"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Search className="h-4 w-4 text-white/60 flex-shrink-0" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search tomato seeds, arabica coffee..."
                className="bg-transparent text-white placeholder-white/50 text-sm w-full outline-none" />
            </div>
            <button type="submit" className="px-6 py-3 rounded-full font-bold text-sm transition-all hover:opacity-90"
              style={{ background: slide.accent, color: '#000' }}>
              Search
            </button>
          </form>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 items-center">
            <Link href={slide.ctaHref}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:opacity-90 hover:scale-105"
              style={{ background: slide.accent, color: '#000' }}>
              {slide.cta} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:bg-white/10"
              style={{ border: '2px solid rgba(255,255,255,0.35)' }}>
              Join Free
            </Link>
            <span className="text-white/40 text-sm hidden md:block">• {slide.stat}</span>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button type="button" onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/20"
        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button type="button" onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/20"
        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {SLIDES.map((s, i) => (
          <button key={s.id} type="button" onClick={() => goTo(i)}
            className="transition-all duration-300 rounded-full"
            style={{ width: i === current ? '28px' : '8px', height: '8px',
              background: i === current ? slide.accent : 'rgba(255,255,255,0.4)' }} />
        ))}
      </div>

      {/* Counter */}
      <div className="absolute bottom-6 right-6 z-20 text-white/40 text-xs font-mono">
        {String(current + 1).padStart(2,'0')} / {String(SLIDES.length).padStart(2,'0')}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
