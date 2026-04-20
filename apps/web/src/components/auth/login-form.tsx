'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { OAuthButtons } from './oauth-buttons';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const { signInWithEmail, isLoading } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginValues) => {
    setErrorMsg('');
    try {
      await signInWithEmail(values.email, values.password);
      toast.success('Welcome back!');
      router.push(redirect);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Login failed';

      // Show helpful messages for common errors
      if (msg.toLowerCase().includes('invalid login credentials') ||
          msg.toLowerCase().includes('invalid credentials')) {
        setErrorMsg(
          'Wrong email or password. If you signed up with Google, use the "Continue with Google" button below instead.'
        );
      } else if (msg.toLowerCase().includes('email not confirmed')) {
        setErrorMsg(
          'Please check your email and click the confirmation link before logging in.'
        );
      } else {
        setErrorMsg(msg);
      }
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-heading font-bold">Welcome Back</h1>
        <p className="text-muted-foreground mt-1">Sign in to your Agro Hub account</p>
      </div>

      {/* Google login first — most common */}
      <OAuthButtons />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or sign in with email</span>
        </div>
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-400">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-muted-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <a href="/register" className="font-semibold text-primary hover:underline">
          Sign up
        </a>
      </p>

      <p className="text-center text-xs text-muted-foreground">
        Forgot password?{' '}
        <a href="/reset-password" className="text-primary hover:underline">
          Reset it here
        </a>
      </p>
    </div>
  );
}
