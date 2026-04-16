'use client';
import { useEffect, useRef, useState } from 'react';
import { Shield, Truck, MessageCircle, Globe, CreditCard, Star } from 'lucide-react';

const FEATURES = [
  { icon: Shield,        title: 'Escrow Protection',  desc: 'Funds held until you confirm delivery. 100% protected.',        color: 'bg-blue-50 text-blue-600',   stat: '100% Protected' },
  { icon: Globe,         title: 'Global Reach',        desc: 'Buyers and sellers from 100+ countries. Any language.',          color: 'bg-green-50 text-green-600', stat: '100+ Countries' },
  { icon: CreditCard,    title: 'Any Currency',        desc: 'PayPal, card, mobile money. Auto-converts to your currency.',    color: 'bg-purple-50 text-purple-600',stat: '8 Payment Methods' },
  { icon: Truck,         title: 'Global Shipping',     desc: 'B2B bulk freight or B2C courier. DHL, FedEx worldwide.',         color: 'bg-orange-50 text-orange-600',stat: 'DHL & FedEx' },
  { icon: MessageCircle, title: 'Direct Chat',         desc: 'Negotiate directly with farmers. Real-time messaging.',          color: 'bg-teal-50 text-teal-600',   stat: 'Real-time' },
  { icon: Star,          title: 'Verified Suppliers',  desc: 'Every supplier is KYC-verified. Trade with confidence.',         color: 'bg-amber-50 text-amber-600', stat: 'KYC Verified' },
];

const TESTIMONIALS = [
  { quote: "I sold my first container of Arabica coffee to Germany through Agro Hub. The escrow gave me total confidence.", name: "James K.", role: "Coffee Farmer, Uganda", flag: "🇺🇬" },
  { quote: "Finding verified avocado suppliers used to be impossible. Agro Hub changed that completely for our business.", name: "Marta V.", role: "Importer, Netherlands", flag: "🇳🇱" },
  { quote: "The mobile money checkout in my currency made it so easy. I bought tilapia fingerlings from Kenya to Zambia.", name: "Grace M.", role: "Fish Farmer, Zambia", flag: "🇿🇲" },
];

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

export function TrustSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-green-600 text-xs font-bold uppercase tracking-widest mb-3">Why thousands trust us</p>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Built for Global<br />Agricultural Trade
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Every feature designed to make cross-border agricultural trading safe, simple, and profitable.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeIn key={f.title} delay={i * 80}>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${f.color}`}><Icon className="h-6 w-6" /></div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{f.stat}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_,j) => <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-lg">{t.flag}</div>
                  <div>
                    <div className="font-bold text-sm text-gray-900 dark:text-white">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
