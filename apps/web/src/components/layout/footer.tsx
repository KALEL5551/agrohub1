'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Globe } from 'lucide-react';
import { CurrencyLanguageModal } from '@/components/payments/currency-language-modal';
import { useCurrencyStore } from '@/lib/forex/currency-store';

const FOOTER_LINKS = {
  Marketplace: [
    { href: '/products',   label: 'All Products' },
    { href: '/cash-crops', label: 'Cash Crops' },
    { href: '/food-crops', label: 'Food Crops' },
    { href: '/livestock',  label: 'Livestock' },
    { href: '/fisheries',  label: 'Fisheries' },
    { href: '/coffee',     label: 'Coffee & Beverages' },
  ],
  Sectors: [
    { href: '/sector/vegetables',      label: 'Vegetables' },
    { href: '/sector/fruits',          label: 'Fruits' },
    { href: '/sector/spices_herbs',    label: 'Spices & Herbs' },
    { href: '/sector/farm_inputs',     label: 'Farm Inputs' },
    { href: '/sector/seeds_nursery',   label: 'Seeds & Nursery' },
    { href: '/sector/agro_processing', label: 'Agro-Processing' },
  ],
  'For Buyers': [
    { href: '/products',  label: 'Browse Products' },
    { href: '/register',  label: 'Create Account' },
    { href: '/help',      label: 'How to Buy' },
    { href: '/shipping',  label: 'Shipping Info' },
    { href: '/disputes',  label: 'Buyer Protection' },
  ],
  'For Sellers': [
    { href: '/register?role=supplier', label: 'Become a Supplier' },
    { href: '/listings/new',           label: 'List a Product' },
    { href: '/help',                   label: 'Seller Guide' },
    { href: '/admin',                  label: 'Seller Center' },
  ],
  Company: [
    { href: '/about',   label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/blog',    label: 'Blog' },
    { href: '/careers', label: 'Careers' },
    { href: '/terms',   label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
  ],
};

// Payment method logos using inline SVG text (no external images needed)
const PAYMENT_METHODS = [
  { name: 'Visa',       bg: '#1a1f71', color: '#fff',    text: 'VISA' },
  { name: 'Mastercard', bg: '#fff',    color: '#eb001b', text: '●●' },
  { name: 'PayPal',     bg: '#003087', color: '#009cde', text: 'Pay' },
  { name: 'MTN MoMo',   bg: '#ffc72c', color: '#000',    text: 'MTN' },
  { name: 'Airtel',     bg: '#e40000', color: '#fff',    text: 'Air' },
  { name: 'M-Pesa',     bg: '#00a651', color: '#fff',    text: 'M-P' },
  { name: 'Stripe',     bg: '#635bff', color: '#fff',    text: 'Str' },
  { name: 'Apple Pay',  bg: '#000',    color: '#fff',    text: '🍎' },
  { name: 'G Pay',      bg: '#fff',    color: '#4285f4', text: 'G' },
  { name: 'SWIFT',      bg: '#002d72', color: '#fff',    text: 'BNK' },
  { name: 'Crypto',     bg: '#f7931a', color: '#fff',    text: '₿' },
  { name: 'AmEx',       bg: '#007bc1', color: '#fff',    text: 'AMX' },
];

const CURRENCY_FLAGS: Record<string, string> = {
  USD:'🇺🇸', EUR:'🇪🇺', GBP:'🇬🇧', UGX:'🇺🇬', KES:'🇰🇪',
  NGN:'🇳🇬', GHS:'🇬🇭', ZAR:'🇿🇦', TZS:'🇹🇿', INR:'🇮🇳',
  CNY:'🇨🇳', BRL:'🇧🇷', AUD:'🇦🇺', CAD:'🇨🇦', JPY:'🇯🇵',
};

export function Footer() {
  const [modalOpen, setModalOpen] = useState(false);
  const { userCurrency } = useCurrencyStore();
  const flag = CURRENCY_FLAGS[userCurrency] || '🌍';

  return (
    <>
      <CurrencyLanguageModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">

        {/* ── TOP: links grid ── */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">

            {/* Brand column */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1">
              <Link href="/">
                <Image src="/images/agro-hub-logo.png" alt="Agro Hub"
                  width={140} height={42} className="h-10 w-auto object-contain mb-4" />
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                The global agricultural marketplace. Buy and sell crops, livestock, fish, coffee,
                medicines, seeds and more — from anywhere in the world.
              </p>

              {/* Language / Currency trigger */}
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all text-sm font-medium"
              >
                <Globe className="h-4 w-4 text-gray-500" />
                <span>{flag} {userCurrency || 'USD'}</span>
                <span className="text-gray-400 text-xs">· English</span>
              </button>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-3">{title}</h4>
                <ul className="space-y-2">
                  {links.map(l => (
                    <li key={l.href}>
                      <Link href={l.href}
                        className="text-sm text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── PAYMENT METHODS STRIP ── */}
        <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 mr-2 whitespace-nowrap">
                Accepted payments:
              </span>
              {PAYMENT_METHODS.map(p => (
                <div
                  key={p.name}
                  title={p.name}
                  className="flex items-center justify-center w-12 h-8 rounded-md text-xs font-black tracking-tight shadow-sm border border-gray-100 dark:border-gray-700 select-none flex-shrink-0"
                  style={{ background: p.bg, color: p.color }}
                >
                  {p.text}
                </div>
              ))}
              <span className="text-xs text-gray-400 ml-2">+ Bank Transfer · USDT · More</span>
            </div>
          </div>
        </div>

        {/* ── APP DOWNLOAD + SOCIAL ── */}
        <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

              {/* App download */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                  Trade on the go:
                </span>
                <a href="#" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors">
                  <span className="text-base">🍎</span>
                  <div>
                    <div className="text-[9px] text-gray-400 leading-none">Download on the</div>
                    <div className="text-sm font-bold leading-none">App Store</div>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors">
                  <span className="text-base">▶</span>
                  <div>
                    <div className="text-[9px] text-gray-400 leading-none">Get it on</div>
                    <div className="text-sm font-bold leading-none">Google Play</div>
                  </div>
                </a>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-500">Stay connected:</span>
                {[
                  { icon: '𝕏', label: 'Twitter/X',  href: '#' },
                  { icon: 'f', label: 'Facebook',   href: '#' },
                  { icon: 'in',label: 'LinkedIn',   href: '#' },
                  { icon: '📷',label: 'Instagram',  href: '#' },
                  { icon: '▶', label: 'YouTube',    href: '#' },
                  { icon: '✉', label: 'Newsletter', href: '#' },
                ].map(s => (
                  <a key={s.label} href={s.href} title={s.label}
                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-3">
                <Image src="/images/agro-hub-logo.png" alt="Agro Hub"
                  width={70} height={21} className="h-5 w-auto object-contain opacity-50" />
                <span>© {new Date().getFullYear()} Agro Hub. All rights reserved.</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 justify-center">
                {['Terms of Service','Privacy Policy','Cookie Policy','Shipping Info','Dispute Resolution'].map((t, i, arr) => (
                  <span key={t} className="flex items-center gap-3">
                    <Link href="#" className="hover:text-green-600 transition-colors">{t}</Link>
                    {i < arr.length - 1 && <span className="text-gray-300">·</span>}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span>🌍 Available Worldwide</span>
                <span>·</span>
                <span>🔒 Escrow Protected</span>
              </div>
            </div>
          </div>
        </div>

      </footer>
    </>
  );
}
