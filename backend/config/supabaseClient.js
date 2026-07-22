import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;

const supabaseBackendKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    "SUPABASE_URL is missing from the backend environment variables.",
  );
}

if (!supabaseBackendKey) {
  throw new Error(
    "SUPABASE_SECRET_KEY, SUPABASE_SERVICE_ROLE_KEY, or SUPABASE_ANON_KEY is missing from the backend environment variables.",
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseBackendKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  },
);

export default supabase;
