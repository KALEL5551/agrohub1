'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ShoppingCart, Menu, Search, Sun, Moon,
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

      <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container-main flex h-16 items-center justify-between">

          {/* Logo + Nav */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image src="/images/agro-hub-logo.png" alt="Agro Hub"
                width={160} height={48} className="h-10 w-auto object-contain" priority />
            </Link>
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">

            {/* Search */}
            <Link href="/products?search=true"
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <Search className="h-5 w-5" />
            </Link>

            {/* Currency / Language selector */}
            <button
              type="button"
              onClick={() => setCurrencyModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-muted-foreground border border-transparent hover:border-border"
              title="Language & Currency"
            >
              <Globe className="h-4 w-4" />
              <span>{flag} {userCurrency || 'USD'}</span>
            </button>

            {/* Dark mode toggle */}
            <button type="button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary text-[10px] font-bold text-white flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <Dropdown
                trigger={
                  <button type="button" className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <Avatar src={user.avatar_url} name={user.full_name} size="sm" />
                    <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                  </button>
                }
              >
                <div className="p-3 border-b">
                  <p className="font-semibold text-sm">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <Badge variant="default" className="mt-1 capitalize">{user.role}</Badge>
                </div>
                <div className="py-1">
                  <Link href="/dashboard" className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link href="/profile" className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted">
                      <LayoutDashboard className="h-4 w-4" /> Admin Panel
                    </Link>
                  )}
                </div>
                <div className="border-t py-1">
                  <DropdownItem onClick={logout} destructive>
                    <LogOut className="h-4 w-4" /> Sign Out
                  </DropdownItem>
                </div>
              </Dropdown>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
                <Link href="/register"><Button size="sm">Sign Up</Button></Link>
              </div>
            )}

            {/* Mobile menu */}
            <button type="button" className="lg:hidden p-2 rounded-lg hover:bg-muted"
              onClick={toggleMobileNav}>
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
