import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  throw new Error(
    "VITE_SUPABASE_URL en VITE_SUPABASE_PUBLISHABLE_KEY ontbreken. Kopieer .env.example naar .env en vul de waarden in.",
  );
}

export const supabase = createClient<Database>(url, publishableKey);
