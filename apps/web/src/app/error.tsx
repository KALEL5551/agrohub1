'use client';

import { Button } from '@/components/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <p className="text-5xl mb-4">⚠️</p>
        <h1 className="text-2xl font-heading font-bold mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">{error.message}</p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  );
}
