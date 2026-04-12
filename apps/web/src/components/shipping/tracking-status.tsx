import { MapPin, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui';

interface TrackingStatusProps {
  trackingNumber: string | null;
  carrier: string | null;
}

export function TrackingStatus({ trackingNumber, carrier }: TrackingStatusProps) {
  if (!trackingNumber) {
    return (
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Tracking not yet available
      </div>
    );
  }

  const trackingUrl =
    carrier === 'DHL'
      ? `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`
      : `#`;

  return (
    <div className="flex items-center gap-3">
      <Badge variant="default">{carrier || 'Carrier'}</Badge>
      <span className="font-mono text-sm">{trackingNumber}</span>
      <a
        href={trackingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
      >
        Track <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}
