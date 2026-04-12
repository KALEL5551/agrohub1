import { Spinner } from '@/components/ui';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="text-muted-foreground mt-4">Loading AgriTrade Africa...</p>
      </div>
    </div>
  );
}
