import Link from 'next/link';
import { ArrowRight, Shield, Truck, MessageCircle, Globe, Leaf } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SearchBar } from '@/components/marketplace/search-bar';
import { AGRO_SECTORS } from '@/lib/constants';

export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden">

        {/* HERO */}
        <section
          className="relative min-h-screen flex items-center text-white"
          style={{ background: 'linear-gradient(135deg, #041f04 0%, #0a3d0a 50%, #1a6b1a 100%)' }}
        >
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 w-full">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#4ade80' }}>
                🌍 Global Agricultural Marketplace
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-4">
                Trade<br />
                <span style={{ color: '#f97316' }}>Agriculture</span><br />
                With the World
              </h1>
              <p className="text-white/75 text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
                Connect with verified farmers and agro-dealers across 100+ countries.
                Seeds, medicines, livestock, fish and more — escrow protected.
              </p>
              <div className="max-w-xl mb-8">
                <SearchBar placeholder="Search tomato seeds, arabica coffee, tilapia..." />
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-green-500 hover:bg-green-400 text-white border-0">
                    Start Trading <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Browse Marketplace
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTORS GRID */}
        <section className="py-20 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2">
                Every sector covered
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
                Explore Agro Sectors
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {AGRO_SECTORS.map((sector) => (
                <Link key={sector.value} href={`/sector/${sector.value}`}>
                  <Card className="group p-4 text-center hover:border-primary hover:shadow-md transition-all cursor-pointer h-full flex flex-col items-center justify-center gap-2">
                    <span className="text-4xl">{sector.icon}</span>
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {sector.label}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {sector.description}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* B2B / B2C */}
        <section className="py-0">
          <div className="grid md:grid-cols-2 min-h-[400px]">
            <div className="relative flex flex-col justify-end p-10 md:p-16 text-white"
              style={{ background: 'linear-gradient(135deg, #0a2e0a, #2d7a2d)' }}>
              <span className="text-green-300 text-xs font-bold uppercase tracking-widest mb-3">For Businesses</span>
              <h3 className="text-3xl font-bold mb-3">B2B Bulk Trading</h3>
              <p className="text-white/70 mb-5 max-w-xs text-sm">
                Container-load sourcing, SWIFT payments, trade documentation.
              </p>
              <Link href="/register?mode=b2b"
                className="inline-flex items-center gap-2 bg-white text-green-900 font-bold px-5 py-2.5 rounded-full text-sm w-fit hover:bg-green-100 transition-colors">
                Start Sourcing <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative flex flex-col justify-end p-10 md:p-16 text-white"
              style={{ background: 'linear-gradient(135deg, #7c2d12, #f97316)' }}>
              <span className="text-orange-200 text-xs font-bold uppercase tracking-widest mb-3">For Everyone</span>
              <h3 className="text-3xl font-bold mb-3">B2C Farm Fresh</h3>
              <p className="text-white/70 mb-5 max-w-xs text-sm">
                Order directly from farmers. PayPal, card, mobile money accepted.
              </p>
              <Link href="/register?mode=b2c"
                className="inline-flex items-center gap-2 bg-white text-orange-900 font-bold px-5 py-2.5 rounded-full text-sm w-fit hover:bg-orange-100 transition-colors">
                Start Shopping <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
                Why Choose Agro Hub?
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Shield className="h-8 w-8" />, title: 'Escrow Protection', desc: 'Funds held until you confirm delivery.', color: 'text-blue-600 bg-blue-100' },
                { icon: <Truck className="h-8 w-8" />, title: 'Global Shipping', desc: 'DHL, FedEx, container shipping worldwide.', color: 'text-purple-600 bg-purple-100' },
                { icon: <MessageCircle className="h-8 w-8" />, title: 'Direct Chat', desc: 'Negotiate directly with farmers.', color: 'text-green-600 bg-green-100' },
                { icon: <Globe className="h-8 w-8" />, title: 'Any Currency', desc: 'PayPal, card, mobile money & more.', color: 'text-orange-600 bg-orange-100' },
              ].map((f) => (
                <Card key={f.title} className="p-6 text-center">
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${f.color}`}>{f.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-24"
          style={{ background: 'linear-gradient(135deg, #052e16, #14532d)' }}>
          <div className="max-w-7xl mx-auto px-6 text-center">
            <Leaf className="h-12 w-12 mx-auto mb-4 text-green-300" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Grow Your Agri Business?
            </h2>
            <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of farmers and buyers trading on Agro Hub worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-green-900 hover:bg-green-50 border-0">
                  Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                  Browse Products
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
