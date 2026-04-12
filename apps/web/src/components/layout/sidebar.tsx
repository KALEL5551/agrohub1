'use client';

import type { ComponentType } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  MessageCircle,
  User,
  Users,
  Shield,
  AlertTriangle,
  Truck,
  FileCheck,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DASHBOARD_NAV, ADMIN_NAV } from '@/lib/constants';
import { useAuthStore } from '@/store/auth-store';

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  ShoppingCart,
  Package,
  MessageCircle,
  User,
  Users,
  Shield,
  AlertTriangle,
  Truck,
  FileCheck,
  BarChart3,
};

interface SidebarProps {
  type: 'dashboard' | 'admin';
}

export function Sidebar({ type }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const navItems = type === 'admin' ? ADMIN_NAV : DASHBOARD_NAV;

  return (
    <aside className="w-64 border-r border-border bg-card min-h-[calc(100vh-4rem)] p-4 hidden lg:block">
      {user && (
        <div className="mb-6 p-3 rounded-lg bg-muted/50">
          <p className="font-semibold text-sm truncate">{user.full_name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.business_name || user.email}</p>
        </div>
      )}

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
