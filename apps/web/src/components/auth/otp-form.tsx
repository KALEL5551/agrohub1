'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

export function OTPForm() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { signInWithOTP, verifyOTP, isLoading } = useAuth();

  const handleSendOTP = async () => {
    try {
      await signInWithOTP(phone);
      setStep('verify');
      toast.success('OTP sent to your phone');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to send OTP');
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      toast.error('Please enter the full 6-digit code');
      return;
    }

    try {
      await verifyOTP(phone, code);
      toast.success('Phone verified!');
      router.push('/dashboard');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Invalid OTP');
    }
  };

  if (step === 'phone') {
    return (
      <div className="w-full max-w-sm mx-auto space-y-6 text-center">
        <h1 className="text-2xl font-heading font-bold">Verify Phone</h1>
        <p className="text-muted-foreground">We&apos;ll send a verification code to your phone</p>

        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+256 700 000 000"
          className="w-full h-12 rounded-lg border border-input bg-background px-4 text-center text-lg"
        />

        <Button onClick={handleSendOTP} className="w-full" isLoading={isLoading}>
          Send Code
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-6 text-center">
      <h1 className="text-2xl font-heading font-bold">Enter Code</h1>
      <p className="text-muted-foreground">Enter the 6-digit code sent to {phone}</p>

      <div className="flex justify-center gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            className="w-12 h-14 rounded-lg border-2 border-input bg-background text-center text-xl font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        ))}
      </div>

      <Button onClick={handleVerify} className="w-full" isLoading={isLoading}>
        Verify
      </Button>

      <button type="button" onClick={handleSendOTP} className="text-sm text-primary hover:underline">
        Resend code
      </button>
    </div>
  );
}
