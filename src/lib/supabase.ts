import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Public browser client — authenticated as the `anon` role, so it can only do
 * what the RLS policies in supabase/migrations/0001_init.sql explicitly allow
 * (insert reservations/contact messages; nothing else). Safe to ship to the
 * client bundle. Real order writes happen server-side in netlify/functions
 * with the service role key, never through this client.
 */
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = Boolean(supabase);
