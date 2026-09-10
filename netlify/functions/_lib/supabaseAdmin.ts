import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service role key — bypasses RLS, so
 * this must never run anywhere but a trusted server environment (a Netlify
 * Function). Never import this from src/.
 */
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, { auth: { persistSession: false } });
}
