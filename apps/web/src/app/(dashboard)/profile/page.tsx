'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Card, Badge } from '@/components/ui';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { WORLD_COUNTRIES } from '@/lib/constants';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      full_name: '',
      phone: '',
      business_name: '',
      business_address: '',
      city: '',
      country: '',
    },
  });

  useEffect(() => {
    if (!user) return;
    reset({
      full_name: user.full_name || '',
      phone: user.phone || '',
      business_name: user.business_name || '',
      business_address: user.business_address || '',
      city: user.city || '',
      country: user.country || '',
    });
  }, [user, reset]);

  const onSubmit = async (values: Record<string, string>) => {
    if (!user) return;
    setIsSaving(true);
    const { error } = await supabase.from('users').update(values).eq('id', user.id);
    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated!');
    }
    setIsSaving(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading font-bold mb-6">Profile</h1>

      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4">
          <Avatar src={user.avatar_url} name={user.full_name} size="lg" />
          <div>
            <h2 className="font-semibold text-lg">{user.full_name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex gap-2 mt-1">
              <Badge className="capitalize">{user.role}</Badge>
              {user.is_verified && <Badge variant="success">Verified</Badge>}
              <Badge variant={user.kyc_status === 'approved' ? 'success' : 'warning'}>
                KYC: {user.kyc_status}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" {...register('full_name')} />
            <Input label="Phone / WhatsApp" {...register('phone')} />
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Business / Farm Information</h3>
          <Input label="Business / Farm Name" {...register('business_name')} />
          <Input label="Business Address" {...register('business_address')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" {...register('city')} />
            <div>
              <label className="block text-sm font-medium mb-1.5">Country</label>
              <select
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                {...register('country')}
              >
                <option value="">Select country</option>
                {WORLD_COUNTRIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        <Button type="submit" isLoading={isSaving}>
          Save Changes
        </Button>
      </form>
    </div>
  );
}
