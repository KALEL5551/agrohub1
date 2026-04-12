import type { Metadata } from 'next';
import { AuthProvider } from '@/providers/auth-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { ToastProvider } from '@/providers/toast-provider';
import { MobileNav } from '@/components/layout/mobile-nav';
import { FloatingAdvisor } from '@/components/ai/floating-advisor';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'agriculture', 'farming', 'agro marketplace', 'cash crops', 'food crops',
    'livestock', 'fisheries', 'coffee', 'seeds', 'fertilizers', 'B2B', 'B2C',
    'global', 'trade', 'Agro Hub',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <MobileNav />
            <ToastProvider />

            {/* 🤖 Floating AI Agro Advisor — appears on every page */}
            <FloatingAdvisor />

          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
