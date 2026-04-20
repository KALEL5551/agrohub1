'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/auth-store';
import type { User } from '@/types/database';

export function useAuth() {
  const router = useRouter();
  const { user, isLoading, setUser, setLoading, logout: clearUser } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    // Get current session immediately
    const getUser = async () => {
      setLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profile) {
          setUser(profile as User);
        } else {
          // Profile not in users table yet — create it from auth metadata
          const newUser: Partial<User> = {
            id: authUser.id,
            email: authUser.email || '',
            full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
            avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null,
            role: 'buyer',
            country: '',
            city: null,
            phone: null,
            business_name: null,
            business_address: null,
            kyc_status: 'pending',
            kyc_documents: null,
            is_verified: false,
            rating: 0,
            total_reviews: 0,
          };

          const { data: created } = await supabase
            .from('users')
            .upsert(newUser)
            .select('*')
            .single();

          setUser((created || newUser) as User);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    getUser();

    // Listen for login / logout changes — this makes buttons disappear immediately
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser(profile as User);
          } else {
            const newUser: Partial<User> = {
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
              role: 'buyer',
              country: '',
              city: null,
              phone: null,
              business_name: null,
              business_address: null,
              kyc_status: 'pending',
              kyc_documents: null,
              is_verified: false,
              rating: 0,
              total_reviews: 0,
            };
            const { data: created } = await supabase
              .from('users')
              .upsert(newUser)
              .select('*')
              .single();
            setUser((created || newUser) as User);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) throw error;
    return data;
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    metadata: { full_name: string; role: string; country: string; phone?: string }
  ) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    setLoading(false);
    if (error) throw error;
    return data;
  };

  const signInWithOTP = async (phone: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({ phone });
    if (error) throw error;
    return data;
  };

  const verifyOTP = async (phone: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
    if (error) throw error;
    return data;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'openid email profile',
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    clearUser();
    router.push('/');
  };

  return {
    user,
    isLoading,
    signInWithEmail,
    signUpWithEmail,
    signInWithOTP,
    verifyOTP,
    signInWithGoogle,
    logout,
  };
}
