'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Globe } from 'lucide-react';
import { CurrencyLanguageModal } from '@/components/payments/currency-language-modal';
import { useCurrencyStore } from '@/lib/forex/currency-store';

const FOOTER_LINKS = {
  'Get Support': [
    { href: '/help', label: 'Help Center' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/disputes', label: 'Dispute Resolution' },
    { href: '/refunds', label: 'Refund Policy' },
    { href: '/shipping', label: 'Shipping Info' },
  ],
  'Payments & Protections': [
    { href: '/payments', label: 'Safe & Easy Payments' },
    { href: '/escrow', label: 'Escrow Protection' },
    { href: '/buyer-protection', label: 'Buyer Protection' },
    { href: '/money-back', label: 'Money-Back Policy' },
    { href: '/shipping-protections', label: 'Shipping Protections' },
  ],
  'Trade on Agro Hub': [
    { href: '/products', label: 'Browse Products' },
    { href: '/register', label: 'Create Account' },
    { href: '/listings/new', label: 'List a Product' },
    { href: '/seller-guide', label: 'Seller Guide' },
    { href: '/seller-center', label: 'Seller Center' },
  ],
  Sectors: [
    { href: '/sector/vegetables', label: 'Vegetables' },
    { href: '/sector/fruits', label: 'Fruits' },
    { href: '/sector/livestock', label: 'Livestock' },
    { href: '/sector/fisheries', label: 'Fisheries' },
    { href: '/sector/coffee', label: 'Coffee & Beverages' },
  ],
  'About Agro Hub': [
    { href: '/about', label: 'About Us' },
    { href: '/careers', label: 'Careers' },
    { href: '/news', label: 'News & Blog' },
    { href: '/partners', label: 'Partners' },
    { href: '/sustainability', label: 'Sustainability' },
  ],
};

const PAYMENT_METHODS = [
  { name: 'Visa', symbol: '💳' },
  { name: 'Mastercard', symbol: '💳' },
  { name: 'PayPal', symbol: '🅿️' },
  { name: 'Apple Pay', symbol: '🍎' },
  { name: 'Google Pay', symbol: '🔵' },
  { name: 'Mobile Money', symbol: '📱' },
  { name: 'Bank Transfer', symbol: '🏦' },
  { name: 'Crypto', symbol: '₿' },
];

const SOCIAL_LINKS = [
  { icon: '𝕏', label: 'Twitter', href: '#' },
  { icon: 'f', label: 'Facebook', href: '#' },
  { icon: 'in', label: 'LinkedIn', href: '#' },
  { icon: '📷', label: 'Instagram', href: '#' },
  { icon: '▶️', label: 'YouTube', href: '#' },
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

      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        
        {/* ──── TOP SECTION: Links Grid ──── */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            
            {/* Brand & Currency Column */}
            <div className="col-span-2 sm:col-span-1">
              <Link href="/">
                <Image src="/images/agro-hub-logo.png" alt="Agro Hub"
                  width={140} height={42} className="h-10 w-auto object-contain mb-6" />
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Global agricultural marketplace connecting farmers and buyers worldwide.
              </p>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors w-full">
                <Globe className="h-4 w-4" />
                <span>{flag} {userCurrency || 'USD'}</span>
              </button>
            </div>

            {/* Footer Link Columns */}
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-4">{title}</h4>
                <ul className="space-y-3">
                  {links.map(link => (
                    <li key={link.href}>
                      <Link href={link.href}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ──── PAYMENT METHODS SECTION ──── */}
        <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">We Accept</h3>
              <div className="flex flex-wrap gap-3">
                {PAYMENT_METHODS.map(method => (
                  <div key={method.name} title={method.name}
                    className="flex items-center justify-center h-10 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:border-green-500 dark:hover:border-green-500 transition-colors">
                    <span className="mr-2">{method.symbol}</span>
                    {method.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ──── APP DOWNLOADS & SOCIAL ──── */}
        <div className="border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* App Downloads */}
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4">Trade On The Go</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="#" className="flex items-center gap-3 bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold">
                    <span className="text-lg">🍎</span>
                    <div className="text-left">
                      <div className="text-xs text-gray-400">Download on</div>
                      <div>App Store</div>
                    </div>
                  </a>
                  <a href="#" className="flex items-center gap-3 bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold">
                    <span className="text-lg">▶️</span>
                    <div className="text-left">
                      <div className="text-xs text-gray-400">Get it on</div>
                      <div>Google Play</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4">Stay Connected</h3>
                <div className="flex items-center gap-3">
                  {SOCIAL_LINKS.map(social => (
                    <a key={social.label} href={social.href} title={social.label}
                      className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors text-sm font-semibold">
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ──── LEGAL FOOTER ──── */}
        <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600 dark:text-gray-400">
              
              <div className="flex items-center gap-2">
                <Image src="/images/agro-hub-logo.png" alt="Agro Hub"
                  width={60} height={18} className="h-4 w-auto object-contain opacity-70" />
                <span>© {new Date().getFullYear()} Agro Hub. All rights reserved.</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Dispute Resolution'].map((link, i, arr) => (
                  <span key={link} className="flex items-center gap-3">
                    <Link href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      {link}
                    </Link>
                    {i < arr.length - 1 && <span className="text-gray-300">·</span>}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-500">
                <span>🌍 Global</span>
                <span>·</span>
                <span>🔒 Secured</span>
              </div>
            </div>
          </div>
        </div>

      </footer>
    </>
  );
}
