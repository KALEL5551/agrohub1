'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ShoppingCart, Search, Sun, Moon,
  LogOut, User, LayoutDashboard, ChevronDown, Globe,
} from 'lucide-react';
import { Button, Avatar, Dropdown, DropdownItem, Badge } from '@/components/ui';
import { CurrencyLanguageModal } from '@/components/payments/currency-language-modal';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { useUIStore } from '@/store/ui-store';
import { useCurrencyStore } from '@/lib/forex/currency-store';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const CURRENCY_FLAGS: Record<string, string> = {
  USD:'🇺🇸', EUR:'🇪🇺', GBP:'🇬🇧', UGX:'🇺🇬', KES:'🇰🇪',
  NGN:'🇳🇬', GHS:'🇬🇭', ZAR:'🇿🇦', INR:'🇮🇳', CNY:'🇨🇳',
};

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { theme, setTheme, toggleMobileNav } = useUIStore();
  const { userCurrency } = useCurrencyStore();
  const [currencyModalOpen, setCurrencyModalOpen] = useState(false);
  const flag = CURRENCY_FLAGS[userCurrency] || '🌍';

  return (
    <>
      <CurrencyLanguageModal isOpen={currencyModalOpen} onClose={() => setCurrencyModalOpen(false)} />

      {/* Top Bar - Clean and minimal */}
      <div className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <div className="hidden sm:flex items-center gap-4">
              <Link href="/help" className="hover:text-primary transition-colors">Help Center</Link>
              <span className="text-gray-300">|</span>
              <Link href="/seller-center" className="hover:text-primary transition-colors">Seller Center</Link>
              <span className="text-gray-300">|</span>
              <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrencyModalOpen(true)}
                className="hover:text-primary transition-colors flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                <span>{flag} {userCurrency || 'USD'} • English</span>
              </button>
              <span className="text-gray-300">|</span>
              <button type="button"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="hover:text-primary transition-colors">
                {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? 'Dark' : 'Light'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image src="/images/agro-hub-logo.png" alt="Agro Hub"
                width={140} height={42} className="h-9 w-auto object-contain" priority />
            </Link>

            {/* Search Bar - Center */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-6">
              <div className="w-full flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Search products, sectors, suppliers..."
                  className="flex-1 px-4 py-2.5 bg-transparent text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:text-white"
                />
                <button className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white transition-colors">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              
              {/* Mobile Search */}
              <Link href="/products?search=true"
                className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
                <Search className="h-5 w-5" />
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* User Account */}
              {user ? (
                <Dropdown
                  trigger={
                    <button type="button" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <Avatar src={user.avatar_url} name={user.full_name} size="sm" />
                      <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400 hidden sm:block" />
                    </button>
                  }
                >
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{user.full_name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    <Badge variant="default" className="mt-2 capitalize text-xs">{user.role}</Badge>
                  </div>
                  <div className="py-1">
                    <Link href="/dashboard" className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link href="/profile" className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <LayoutDashboard className="h-4 w-4" /> Admin Panel
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                    <DropdownItem onClick={logout} destructive>
                      <LogOut className="h-4 w-4" /> Sign Out
                    </DropdownItem>
                  </div>
                </Dropdown>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login"><Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300">Log In</Button></Link>
                  <Link href="/register"><Button size="sm" className="bg-green-600 hover:bg-green-700">Sign Up</Button></Link>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links - Below header */}
          <nav className="hidden lg:flex items-center gap-6 mt-4 border-t border-gray-200 dark:border-gray-800 pt-4 -mx-6 px-6">
            <Link href="/" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Home
            </Link>
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors whitespace-nowrap',
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                )}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
