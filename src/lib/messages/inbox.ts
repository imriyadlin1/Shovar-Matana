import { cache } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type InboxRow = {
  conversationId: string;
  assetTitle: string | null;
  assetId: string | null;
  peerLabel: string;
  lastPreview: string | null;
  lastAt: string;
};

function previewBody(body: string, max = 72) {
  const t = body.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

async function loadInboxForUserWithClient(
  supabase: SupabaseClient,
  userId: string,
): Promise<InboxRow[]> {
  const { data: parts } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", userId);

  const convIds = [...new Set((parts ?? []).map((p) => p.conversation_id))];
  if (!convIds.length) return [];

  const { data: convs } = await supabase
    .from("conversations")
    .select("id, context_type, context_id, created_at")
    .in("id", convIds);

  const { data: allParticipants } = await supabase
    .from("conversation_participants")
    .select("conversation_id, user_id")
    .in("conversation_id", convIds);

  const peerIdByConv = new Map<string, string>();
  for (const row of allParticipants ?? []) {
    if (row.user_id === userId) continue;
    if (!peerIdByConv.has(row.conversation_id)) {
      peerIdByConv.set(row.conversation_id, row.user_id);
    }
  }

  const uniquePeerIds = [...new Set(peerIdByConv.values())];
  const { data: profiles } = uniquePeerIds.length
    ? await supabase.from("profiles").select("id, full_name, email").in("id", uniquePeerIds)
    : { data: [] as { id: string; full_name: string | null; email: string | null }[] };

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  const assetIds = [
    ...new Set(
      (convs ?? [])
        .filter((c) => c.context_type === "asset" && c.context_id)
        .map((c) => c.context_id as string),
    ),
  ];

  const { data: assets } = assetIds.length
    ? await supabase.from("assets").select("id, title").in("id", assetIds)
    : { data: [] as { id: string; title: string }[] };

  const titleByAsset = new Map((assets ?? []).map((a) => [a.id, a.title]));

  const msgLimit = Math.min(2000, Math.max(120, convIds.length * 30));
  const { data: recentMsgs } = await supabase
    .from("messages")
    .select("conversation_id, body, created_at")
    .in("conversation_id", convIds)
    .order("created_at", { ascending: false })
    .limit(msgLimit);

  const lastByConv = new Map<string, { body: string; created_at: string }>();
  for (const m of recentMsgs ?? []) {
    if (!lastByConv.has(m.conversation_id)) {
      lastByConv.set(m.conversation_id, { body: m.body, created_at: m.created_at });
    }
  }

  const rows: InboxRow[] = (convs ?? []).map((c) => {
    const peerId = peerIdByConv.get(c.id);
    const prof = peerId ? profileById.get(peerId) : undefined;
    const peerLabel = prof?.full_name?.trim() || prof?.email || "משתמש";
    const assetId = c.context_type === "asset" ? c.context_id : null;
    const assetTitle = assetId ? titleByAsset.get(assetId) ?? null : null;
    const last = lastByConv.get(c.id);
    const lastAt = last?.created_at ?? c.created_at;
    const lastPreview = last ? previewBody(last.body) : null;
    return {
      conversationId: c.id,
      assetTitle,
      assetId,
      peerLabel,
      lastPreview,
      lastAt,
    };
  });

  rows.sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());
  return rows;
}

/** טוען רשימת שיחות — ממוזג לפי `userId` ברינדור יחיד (layout + עמוד). */
export const loadInboxForUser = cache(async function loadInboxForUser(userId: string): Promise<InboxRow[]> {
  const supabase = await createClient();
  return loadInboxForUserWithClient(supabase, userId);
});
