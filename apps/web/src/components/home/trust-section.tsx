'use client';

import { useEffect, useRef, useState } from 'react';
import { Shield, Truck, MessageCircle, Globe, CreditCard, Star } from 'lucide-react';

const FEATURES = [
  {
    icon: Shield,
    title: 'Escrow Protection',
    desc: 'Your money is held safely until you confirm delivery. 100% of orders are escrow-protected.',
    color: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
    stat: '100% Protected',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    desc: 'Buyers and sellers from 100+ countries. Trade in any language, any currency, anywhere.',
    color: 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400',
    stat: '100+ Countries',
  },
  {
    icon: CreditCard,
    title: 'Any Currency',
    desc: 'PayPal, card, mobile money, bank transfer, crypto. Prices auto-convert to your local currency.',
    color: 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400',
    stat: '8 Payment Methods',
  },
  {
    icon: Truck,
    title: 'Global Shipping',
    desc: 'B2B bulk freight or B2C courier. DHL, FedEx, container shipping. Live quotes at checkout.',
    color: 'bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400',
    stat: 'DHL & FedEx',
  },
  {
    icon: MessageCircle,
    title: 'Direct Chat',
    desc: 'Negotiate directly with farmers before ordering. Real-time messaging, no middlemen.',
    color: 'bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400',
    stat: 'Real-time',
  },
  {
    icon: Star,
    title: 'Verified Suppliers',
    desc: 'Every supplier is KYC-verified. Read reviews, check ratings, trade with confidence.',
    color: 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400',
    stat: 'KYC Verified',
  },
];

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const Icon = feature.icon;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.6s ease ${index * 100}ms, transform 0.6s ease ${index * 100}ms, box-shadow 0.3s, translate 0.3s`,
      }}
    >
      <div className={`inline-flex p-3 rounded-xl mb-4 ${feature.color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
        {feature.stat}
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
    </div>
  );
}

export function TrustSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.2 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">

        <div
          ref={headerRef}
          className="text-center mb-14"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <p className="text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-widest mb-3">
            Why thousands of farmers trust us
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Built for Global<br />Agricultural Trade
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Every feature designed to make cross-border agricultural trading safe, simple, and profitable for both farmers and buyers worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>

        {/* Testimonial strip */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { quote: "I sold my first container of Arabica coffee to Germany through Agro Hub. The escrow gave me total confidence.", name: "James K.", role: "Coffee Farmer, Uganda", flag: "🇺🇬" },
            { quote: "As a buyer in Netherlands, finding verified African avocado suppliers used to be impossible. Agro Hub changed that.", name: "Marta V.", role: "Importer, Netherlands", flag: "🇳🇱" },
            { quote: "The mobile money checkout in my currency made it so easy. I bought tilapia fingerlings from Kenya to Zambia.", name: "Grace M.", role: "Fish Farmer, Zambia", flag: "🇿🇲" },
          ].map((t, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-4">"{t.quote}"</p>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-lg">
                  {t.flag}
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
