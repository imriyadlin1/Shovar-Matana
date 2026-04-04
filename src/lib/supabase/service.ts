import { createClient } from "@supabase/supabase-js";

/** Supabase client with service-role key — bypasses RLS. Server-only. */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase service-role config");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
