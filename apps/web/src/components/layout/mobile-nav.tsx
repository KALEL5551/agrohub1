'use client';

import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useUIStore } from '@/store/ui-store';
import { NAV_LINKS } from '@/lib/constants';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui';

export function MobileNav() {
  const { mobileNavOpen, closeMobileNav } = useUIStore();
  const { user, logout } = useAuth();

  if (!mobileNavOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={closeMobileNav} />
      <div className="fixed right-0 top-0 h-full w-72 bg-card shadow-xl animate-slide-in-right">

        {/* Header with logo */}
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/" onClick={closeMobileNav}>
            <Image
              src="/images/agro-hub-logo.png"
              alt="Agro Hub"
              width={120}
              height={36}
              className="h-8 w-auto object-contain"
            />
          </Link>
          <button type="button" onClick={closeMobileNav} className="p-2 rounded-lg hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobileNav}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <Link href="/dashboard" onClick={closeMobileNav} className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted">Dashboard</Link>
              <Link href="/orders"    onClick={closeMobileNav} className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted">Orders</Link>
              <Link href="/chat"      onClick={closeMobileNav} className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted">Messages</Link>
              <div className="pt-4 border-t mt-4">
                <Button variant="destructive" className="w-full" onClick={logout}>Sign Out</Button>
              </div>
            </>
          ) : (
            <div className="pt-4 border-t mt-4 space-y-2">
              <Link href="/login"    onClick={closeMobileNav}><Button variant="outline" className="w-full">Log In</Button></Link>
              <Link href="/register" onClick={closeMobileNav}><Button className="w-full">Sign Up</Button></Link>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
