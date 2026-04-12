'use client';

import { useEffect, type ReactNode } from 'react';
import { useUIStore } from '@/store/ui-store';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useUIStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
