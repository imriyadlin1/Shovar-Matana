import { createClient } from "@/lib/supabase/server";

/**
 * מחזיר מזהה שיחה קיימת (נכס + שני משתמשים) או יוצר שיחה + משתתפים.
 * קונה = משתמש מחובר; בעל הנכס = owner_id.
 */
export async function ensureAssetConversation(assetId: string): Promise<
  | { ok: true; conversationId: string }
  | { ok: false; error: "not_found" | "not_listed" | "self" | "unauthorized" | "db"; message?: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.warn("[ensureAssetConversation] no session", { assetId });
    return { ok: false, error: "unauthorized" };
  }

  const { data: asset, error: assetErr } = await supabase
    .from("assets")
    .select("id, owner_id, status")
    .eq("id", assetId)
    .maybeSingle();

  if (assetErr || !asset) {
    console.error("[ensureAssetConversation] asset load", { assetId, err: assetErr?.message });
    return { ok: false, error: "not_found" };
  }
  if (asset.status !== "listed") {
    console.warn("[ensureAssetConversation] not listed", { assetId, status: asset.status });
    return { ok: false, error: "not_listed" };
  }
  if (asset.owner_id === user.id) {
    console.warn("[ensureAssetConversation] self chat blocked", { assetId });
    return { ok: false, error: "self" };
  }

  const ownerId = asset.owner_id;
  const assetPk = asset.id;

  const { data: myRows } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", user.id);

  const myConvIds = [...new Set((myRows ?? []).map((r) => r.conversation_id))];

  if (myConvIds.length > 0) {
    const { data: convs } = await supabase
      .from("conversations")
      .select("id")
      .in("id", myConvIds)
      .eq("context_type", "asset")
      .eq("context_id", assetPk);

    for (const c of convs ?? []) {
      const { data: parts } = await supabase
        .from("conversation_participants")
        .select("user_id")
        .eq("conversation_id", c.id);

      const ids = new Set((parts ?? []).map((p) => p.user_id));
      if (ids.has(user.id) && ids.has(ownerId) && ids.size >= 2) {
        return { ok: true, conversationId: c.id };
      }
    }
  }

  const { data: newConv, error: convErr } = await supabase
    .from("conversations")
    .insert({ context_type: "asset", context_id: assetPk })
    .select("id")
    .single();

  if (convErr || !newConv) {
    console.error("[ensureAssetConversation] insert conversation", convErr?.message);
    return { ok: false, error: "db", message: convErr?.message };
  }

  const cid = newConv.id;

  const { error: e1 } = await supabase.from("conversation_participants").insert({
    conversation_id: cid,
    user_id: user.id,
  });
  if (e1) {
    console.error("[ensureAssetConversation] insert buyer participant", e1.message);
    return { ok: false, error: "db", message: e1.message };
  }

  const { error: e2 } = await supabase.from("conversation_participants").insert({
    conversation_id: cid,
    user_id: ownerId,
  });
  if (e2) {
    console.error("[ensureAssetConversation] insert seller participant", e2.message);
    return { ok: false, error: "db", message: e2.message };
  }

  console.log("[ensureAssetConversation] created", { conversationId: cid, assetId: assetPk });
  return { ok: true, conversationId: cid };
}
