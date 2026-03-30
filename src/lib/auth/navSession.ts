import { createClient } from "@/lib/supabase/server";

export type NavSession = {
  email: string | null;
  displayName: string | null;
  isAdmin: boolean;
};

export async function getNavSession(): Promise<NavSession> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { email: null, displayName: null, isAdmin: false };
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .maybeSingle();
    return {
      email: user.email ?? null,
      displayName: profile?.full_name?.trim() || null,
      isAdmin: profile?.role === "admin",
    };
  } catch {
    return { email: null, displayName: null, isAdmin: false };
  }
}
