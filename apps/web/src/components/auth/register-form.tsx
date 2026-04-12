'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Phone, Building } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { WORLD_COUNTRIES } from '@/lib/constants';
import { OAuthButtons } from './oauth-buttons';

const registerSchema = z
  .object({
    full_name: z.string().min(2, 'Enter your full name'),
    email: z.string().email('Enter a valid email'),
    phone: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    role: z.enum(['buyer', 'supplier']),
    country: z.string().min(1, 'Select your country'),
    business_name: z.string().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { signUpWithEmail, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'buyer' },
  });

  const role = watch('role');

  const onSubmit = async (values: RegisterValues) => {
    try {
      await signUpWithEmail(values.email, values.password, {
        full_name: values.full_name,
        role: values.role,
        country: values.country,
        phone: values.phone,
      });
      toast.success('Account created! Please verify your email.');
      router.push('/verify-otp');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-heading font-bold">Create Account</h1>
        <p className="text-muted-foreground mt-1">Join the global agricultural marketplace</p>
      </div>

      <OAuthButtons />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or register with email</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label
          className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
            role === 'buyer' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
        >
          <input type="radio" value="buyer" className="sr-only" {...register('role')} />
          <span className="text-2xl mb-1">🛒</span>
          <span className="font-semibold text-sm">I want to Buy</span>
          <span className="text-xs text-muted-foreground">Source agro products</span>
        </label>
        <label
          className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
            role === 'supplier' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
        >
          <input type="radio" value="supplier" className="sr-only" {...register('role')} />
          <span className="text-2xl mb-1">🌾</span>
          <span className="font-semibold text-sm">I want to Sell</span>
          <span className="text-xs text-muted-foreground">List your products</span>
        </label>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="John Smith"
          icon={<User className="h-4 w-4" />}
          error={errors.full_name?.message}
          {...register('full_name')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          icon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Phone / WhatsApp (optional)"
          placeholder="+1 234 567 8900"
          icon={<Phone className="h-4 w-4" />}
          {...register('phone')}
        />
        <div>
          <label className="block text-sm font-medium mb-1.5">Country</label>
          <select
            className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
            {...register('country')}
          >
            <option value="">Select your country</option>
            {WORLD_COUNTRIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.country && (
            <p className="mt-1 text-sm text-destructive">{errors.country.message}</p>
          )}
        </div>
        {role === 'supplier' && (
          <Input
            label="Business / Farm Name"
            placeholder="Green Valley Farms Ltd"
            icon={<Building className="h-4 w-4" />}
            {...register('business_name')}
          />
        )}
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <a href="/login" className="font-semibold text-primary hover:underline">Sign in</a>
      </p>
    </div>
  );
}
