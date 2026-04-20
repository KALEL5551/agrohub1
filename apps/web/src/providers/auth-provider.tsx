'use client';

import { useEffect, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/auth-store';
import type { User } from '@/types/database';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, setLoading } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    setLoading(true);

    // Get session on first load
    const initAuth = async () => {
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
          // Auto-create profile for Google/OAuth users
          const newUser = {
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
          await supabase.from('users').upsert(newUser);
          setUser(newUser as User);
        }
      } else {
        setUser(null);
      }
    };

    initAuth();

    // Listen for ALL auth changes — this is what makes buttons disappear instantly
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser(profile as User);
          } else {
            const newUser = {
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
            await supabase.from('users').upsert(newUser);
            setUser(newUser as User);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
