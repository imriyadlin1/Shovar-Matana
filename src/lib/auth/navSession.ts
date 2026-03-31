import { createClient } from "@/lib/supabase/server";

export type NavSession = {
  email: string | null;
  displayName: string | null;
  isAdmin: boolean;
  unreadConvCount: number;
};

export async function getNavSession(): Promise<NavSession> {
  const empty: NavSession = { email: null, displayName: null, isAdmin: false, unreadConvCount: 0 };
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return empty;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .maybeSingle();

    const unreadConvCount = await countUnreadConversations(supabase, user.id);

    return {
      email: user.email ?? null,
      displayName: profile?.full_name?.trim() || null,
      isAdmin: profile?.role === "admin",
      unreadConvCount,
    };
  } catch {
    return empty;
  }
}

async function countUnreadConversations(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<number> {
  try {
    const { data: parts } = await supabase
      .from("conversation_participants")
      .select("conversation_id, last_read_at")
      .eq("user_id", userId);
    if (!parts?.length) return 0;

    const convIds = parts.map((p) => p.conversation_id);
    const readMap = new Map(parts.map((p) => [p.conversation_id, p.last_read_at as string | null]));

    const { data: msgs } = await supabase
      .from("messages")
      .select("conversation_id, sender_id, created_at")
      .in("conversation_id", convIds)
      .order("created_at", { ascending: false })
      .limit(convIds.length * 5);

    if (!msgs?.length) return 0;

    const seen = new Set<string>();
    let count = 0;
    for (const m of msgs) {
      if (seen.has(m.conversation_id)) continue;
      seen.add(m.conversation_id);
      if (m.sender_id === userId) continue;
      const lastRead = readMap.get(m.conversation_id);
      if (!lastRead || new Date(m.created_at) > new Date(lastRead)) {
        count++;
      }
    }
    return count;
  } catch {
    return 0;
  }
}
