import { createClient } from '@supabase/supabase-js';
import { getSupabasePublicEnv } from '@/lib/supabase/config';

const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder-service-role';

export function createAdminClient() {
  const { url } = getSupabasePublicEnv();
  return createClient(
    url,
    serviceRole,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
