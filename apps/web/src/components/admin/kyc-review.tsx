'use client';

import { useState } from 'react';
import { Button, Card, Badge } from '@/components/ui';
import { FileCheck, X, Check } from 'lucide-react';
import type { User } from '@/types';

interface KycReviewProps {
  user: User;
  onApprove: (userId: string) => void;
  onReject: (userId: string, reason: string) => void;
}

export function KycReview({ user, onApprove, onReject }: KycReviewProps) {
  const [reason, setReason] = useState('');

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <FileCheck className="h-5 w-5" />
          KYC Review — {user.business_name || user.full_name}
        </h3>
        <Badge variant={user.kyc_status === 'pending' ? 'warning' : 'muted'}>
          {user.kyc_status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <span className="text-muted-foreground">Full Name:</span>
          <p className="font-medium">{user.full_name}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Country:</span>
          <p className="font-medium">{user.country}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Email:</span>
          <p className="font-medium">{user.email}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Phone:</span>
          <p className="font-medium">{user.phone || '—'}</p>
        </div>
      </div>

      {user.kyc_documents && user.kyc_documents.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Submitted Documents</h4>
          <div className="grid grid-cols-2 gap-2">
            {user.kyc_documents.map((doc, i) => (
              <a
                key={i}
                href={doc}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg border hover:bg-muted text-sm text-primary"
              >
                📄 Document {i + 1}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Rejection reason (optional for approval)..."
          className="w-full h-20 rounded-lg border border-input px-3 py-2 text-sm resize-none"
        />
        <div className="flex gap-2">
          <Button type="button" onClick={() => onApprove(user.id)}>
            <Check className="mr-1 h-4 w-4" />
            Approve
          </Button>
          <Button type="button" variant="destructive" onClick={() => onReject(user.id, reason)}>
            <X className="mr-1 h-4 w-4" />
            Reject
          </Button>
        </div>
      </div>
    </Card>
  );
}
