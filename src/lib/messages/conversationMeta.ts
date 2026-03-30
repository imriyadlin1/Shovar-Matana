import type { SupabaseClient } from "@supabase/supabase-js";

export type ConversationThreadMeta = {
  peerLabel: string;
  assetTitle: string | null;
  assetId: string | null;
};

export async function getConversationThreadMeta(
  supabase: SupabaseClient,
  conversationId: string,
  currentUserId: string,
): Promise<ConversationThreadMeta> {
  const { data: conv } = await supabase
    .from("conversations")
    .select("id, context_type, context_id")
    .eq("id", conversationId)
    .maybeSingle();

  const { data: cps } = await supabase
    .from("conversation_participants")
    .select("user_id")
    .eq("conversation_id", conversationId);

  const otherId = cps?.find((p) => p.user_id !== currentUserId)?.user_id;
  let peerLabel = "משתמש";
  if (otherId) {
    const { data: prof } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", otherId)
      .maybeSingle();
    peerLabel = prof?.full_name?.trim() || prof?.email || peerLabel;
  }

  let assetTitle: string | null = null;
  let assetId: string | null = null;
  if (conv?.context_type === "asset" && conv.context_id) {
    assetId = conv.context_id;
    const { data: a } = await supabase.from("assets").select("title").eq("id", assetId).maybeSingle();
    assetTitle = a?.title ?? null;
  }

  return { peerLabel, assetTitle, assetId };
}
