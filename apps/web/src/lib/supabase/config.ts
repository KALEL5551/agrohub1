/**
 * Real Supabase credentials must be set in apps/web/.env.local
 * (copy from .env.local.example). Restart `npm run dev` after editing.
 */
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  if (!rawUrl || !rawKey) return false;
  if (rawUrl.includes('placeholder') || rawKey === 'placeholder-anon-key') return false;
  if (rawUrl.includes('your-project')) return false;
  return true;
}

/** Values passed to createBrowserClient / middleware (build-safe fallbacks). */
export function getSupabasePublicEnv() {
  return {
    url: rawUrl ?? 'https://placeholder.supabase.co',
    anonKey: rawKey ?? 'placeholder-anon-key',
  };
}
