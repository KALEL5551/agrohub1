import Link from 'next/link';
import { ArrowRight, Shield, Truck, MessageCircle, Globe, ChevronDown } from 'lucide-react';
import { HeroSlider } from '@/components/home/hero-slider';
import { SectorScroll } from '@/components/home/sector-scroll';
import { StatsBar } from '@/components/home/stats-bar';
import { FeaturedSection } from '@/components/home/featured-section';
import { TrustSection } from '@/components/home/trust-section';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AGRO_SECTORS } from '@/lib/constants';
import type { Product } from '@/types';

export const revalidate = 300;

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('products')
    .select('*, supplier:users!supplier_id(id, full_name, business_name, avatar_url, country, rating, is_verified)')
    .eq('listing_status', 'active')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8);
  return (data as Product[]) || [];
}

async function getStats() {
  const supabase = createServerSupabaseClient();
  const [products, suppliers, countries] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('listing_status', 'active'),
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'supplier'),
    supabase.from('users').select('country').eq('role', 'supplier'),
  ]);
  const uniqueCountries = new Set(countries.data?.map((u) => u.country) || []);
  return {
    products: products.count || 0,
    suppliers: suppliers.count || 0,
    countries: uniqueCountries.size || 0,
  };
}

export default async function HomePage() {
  const [featuredProducts, stats] = await Promise.all([getFeaturedProducts(), getStats()]);

  return (
    <>
      <Header />
      <main className="overflow-x-hidden">

        {/* ── HERO SLIDER ── */}
        <HeroSlider />

        {/* ── STATS BAR ── */}
        <StatsBar
          products={stats.products}
          suppliers={stats.suppliers}
          countries={stats.countries}
        />

        {/* ── SECTOR SCROLL STRIP ── */}
        <SectorScroll sectors={AGRO_SECTORS} />

        {/* ── FEATURED PRODUCTS ── */}
        {featuredProducts.length > 0 && (
          <FeaturedSection products={featuredProducts} />
        )}

        {/* ── B2B / B2C SPLIT ── */}
        <section className="relative py-0 overflow-hidden">
          <div className="grid md:grid-cols-2 min-h-[500px]">
            {/* B2B */}
            <div
              className="relative flex flex-col justify-end p-10 md:p-16 text-white overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #0a2e0a 0%, #1a5c1a 50%, #2d7a2d 100%)',
              }}
            >
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              <span className="text-green-300 text-xs font-bold uppercase tracking-widest mb-3">For Businesses</span>
              <h3 className="text-4xl font-bold mb-4 leading-tight">B2B Bulk<br />Trading</h3>
              <p className="text-white/70 mb-6 max-w-xs">
                Container-load sourcing, SWIFT payments, trade documentation, and direct farm-gate pricing.
              </p>
              <Link href="/register?mode=b2b"
                className="inline-flex items-center gap-2 bg-white text-green-900 font-bold px-6 py-3 rounded-full text-sm w-fit hover:bg-green-100 transition-colors">
                Start Sourcing <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* B2C */}
            <div
              className="relative flex flex-col justify-end p-10 md:p-16 text-white overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #f97316 100%)',
              }}
            >
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.5' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              <span className="text-orange-200 text-xs font-bold uppercase tracking-widest mb-3">For Everyone</span>
              <h3 className="text-4xl font-bold mb-4 leading-tight">B2C Farm<br />Fresh</h3>
              <p className="text-white/70 mb-6 max-w-xs">
                Order directly from farmers worldwide. Small quantities welcome. PayPal, card, mobile money accepted.
              </p>
              <Link href="/register?mode=b2c"
                className="inline-flex items-center gap-2 bg-white text-orange-900 font-bold px-6 py-3 rounded-full text-sm w-fit hover:bg-orange-100 transition-colors">
                Start Shopping <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── TRUST SECTION ── */}
        <TrustSection />

        {/* ── CTA BANNER ── */}
        <section className="relative overflow-hidden py-24"
          style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 40%, #166534 100%)' }}>
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="container mx-auto max-w-7xl px-6 text-center relative z-10">
            <p className="text-green-300 text-sm font-bold uppercase tracking-widest mb-4">Join the movement</p>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Grow Your Agri<br />Business Globally
            </h2>
            <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
              Thousands of farmers and buyers from 100+ countries are already trading on Agro Hub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register"
                className="inline-flex items-center justify-center gap-2 bg-white text-green-900 font-bold px-8 py-4 rounded-full text-base hover:bg-green-50 transition-all hover:scale-105">
                Create Free Account <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/products"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-bold px-8 py-4 rounded-full text-base hover:bg-white/10 transition-all">
                Browse Marketplace
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
