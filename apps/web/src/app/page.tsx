import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSlider } from '@/components/home/hero-slider';
import { StatsBar } from '@/components/home/stats-bar';
import { SectorScroll } from '@/components/home/sector-scroll';
import { TrustSection } from '@/components/home/trust-section';
import { AGRO_SECTORS } from '@/lib/constants';

export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden">

        <HeroSlider />
        <StatsBar />
        <SectorScroll sectors={AGRO_SECTORS} />
        <TrustSection />

        {/* B2B / B2C split */}
        <section className="grid md:grid-cols-2 min-h-[420px]">
          <div className="relative flex flex-col justify-end p-10 md:p-16 text-white overflow-hidden group"
            style={{ background: 'linear-gradient(135deg,#0a2e0a,#2d7a2d)' }}>
            <span className="text-green-300 text-xs font-bold uppercase tracking-widest mb-3">For Businesses</span>
            <h3 className="text-4xl font-bold mb-3 leading-tight">B2B Bulk<br />Trading</h3>
            <p className="text-white/70 mb-6 max-w-xs text-sm">Container-load sourcing, SWIFT payments, trade documentation.</p>
            <Link href="/register?mode=b2b"
              className="inline-flex items-center gap-2 bg-white text-green-900 font-bold px-6 py-3 rounded-full text-sm w-fit hover:bg-green-50 transition-colors">
              Start Sourcing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative flex flex-col justify-end p-10 md:p-16 text-white overflow-hidden group"
            style={{ background: 'linear-gradient(135deg,#7c2d12,#f97316)' }}>
            <span className="text-orange-200 text-xs font-bold uppercase tracking-widest mb-3">For Everyone</span>
            <h3 className="text-4xl font-bold mb-3 leading-tight">B2C Farm<br />Fresh</h3>
            <p className="text-white/70 mb-6 max-w-xs text-sm">Order from farmers worldwide. PayPal, card, mobile money accepted.</p>
            <Link href="/register?mode=b2c"
              className="inline-flex items-center gap-2 bg-white text-orange-900 font-bold px-6 py-3 rounded-full text-sm w-fit hover:bg-orange-50 transition-colors">
              Start Shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-24"
          style={{ background: 'linear-gradient(135deg,#052e16 0%,#14532d 50%,#166534 100%)' }}>
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-green-300 text-xs font-bold uppercase tracking-widest mb-4">Join the movement</p>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Grow Your Agri<br />Business Globally
            </h2>
            <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
              Thousands of farmers and buyers from 100+ countries are already trading on Agro Hub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-green-900 hover:bg-green-50 border-0 px-8 py-4 text-base font-bold rounded-full">
                  Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-base font-bold rounded-full">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
