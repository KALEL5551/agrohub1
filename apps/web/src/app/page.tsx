import Link from 'next/link';
import { ArrowRight, Shield, Globe, CreditCard, Truck, MessageCircle, Star, Leaf } from 'lucide-react';
import { Button } from '@/components/ui';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectorScroll } from '@/components/home/sector-scroll';
import { AGRO_SECTORS } from '@/lib/constants';

export const revalidate = 300;

// ─────── FEATURE ICONS ────────
const FEATURES = [
  { icon: Shield, title: 'Escrow Protection', desc: '100% protected transactions', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  { icon: Globe, title: 'Global Reach', desc: '100+ countries & counting', color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
  { icon: CreditCard, title: 'Any Currency', desc: '8 payment methods supported', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
  { icon: Truck, title: 'Fast Shipping', desc: 'DHL, FedEx, local couriers', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' },
  { icon: MessageCircle, title: 'Direct Chat', desc: 'Real-time messaging with sellers', color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' },
  { icon: Star, title: 'Verified Suppliers', desc: 'KYC-verified traders only', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
];

// ─────── STATS CARDS ────────
const STATS = [
  { number: '50K+', label: 'Products Listed', icon: '📦' },
  { number: '100+', label: 'Countries', icon: '🌍' },
  { number: '24/7', label: 'Support', icon: '📞' },
  { number: '100%', label: 'Escrow Protected', icon: '🔒' },
];

// ─────── HOW IT WORKS ────────
const STEPS = [
  {
    num: '01',
    title: 'Browse Products',
    desc: 'Explore thousands of agricultural products from verified sellers worldwide.',
  },
  {
    num: '02',
    title: 'Negotiate & Chat',
    desc: 'Communicate directly with farmers and suppliers in real-time.',
  },
  {
    num: '03',
    title: 'Secure Payment',
    desc: 'Pay safely with 8 payment methods. Escrow holds funds until delivery.',
  },
  {
    num: '04',
    title: 'Receive & Rate',
    desc: 'Get your products. Rate the seller and build trust.',
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden">

        {/* ──── HERO SECTION ──── */}
        <section className="relative py-16 lg:py-24 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider mb-6">
                  🌾 Global Agricultural Marketplace
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                  Trade Agriculture
                  <span className="text-green-600 dark:text-green-400"> With the World</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-lg">
                  Connect with verified farmers, suppliers, and buyers across 100+ countries. Buy and sell crops, livestock, seeds, coffee, and more with complete peace of mind.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/products">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold w-full sm:w-auto">
                      Browse Marketplace <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 px-8 py-3 rounded-lg font-bold w-full sm:w-auto">
                      Create Free Account
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {STATS.map((stat) => (
                  <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{stat.number}</div>
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ──── FEATURES SECTION ──── */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Thousands Trust Agro Hub
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Built for safe, simple, and profitable agricultural trading.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="group">
                    <div className={`${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ──── SECTORS CAROUSEL ──── */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Explore Agricultural Sectors
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Find products across all major agricultural categories.
              </p>
            </div>
            <SectorScroll sectors={AGRO_SECTORS} />
          </div>
        </section>

        {/* ──── HOW IT WORKS ──── */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Simple, secure, and transparent trading in 4 easy steps.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {STEPS.map((step, idx) => (
                <div key={step.num} className="relative">
                  {/* Arrow connector */}
                  {idx < STEPS.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-8 h-0.5 bg-gradient-to-r from-green-400 to-transparent"></div>
                  )}
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl font-bold text-green-600 dark:text-green-400">{step.num}</div>
                      {idx === 0 && <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
