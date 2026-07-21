import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;

const supabaseBackendKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "SUPABASE_URL is missing from the backend environment variables.",
  );
}

if (!supabaseBackendKey) {
  throw new Error(
    "SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY is missing from the backend environment variables.",
  );
}

const supabase = createClient(
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