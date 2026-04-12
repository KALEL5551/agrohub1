import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { Spinner } from '@/components/ui';

export const metadata: Metadata = { title: 'Sign In' };

export default function LoginPage() {
  return (
    <Suspense fallback={<Spinner className="py-20" />}>
      <LoginForm />
    </Suspense>
  );
}
