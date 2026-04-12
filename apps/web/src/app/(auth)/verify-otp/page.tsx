import type { Metadata } from 'next';
import { OTPForm } from '@/components/auth/otp-form';

export const metadata: Metadata = { title: 'Verify Phone' };

export default function VerifyOTPPage() {
  return <OTPForm />;
}
