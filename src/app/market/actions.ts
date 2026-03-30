"use server";

import { redirect } from "next/navigation";
import { ensureAssetConversation } from "@/lib/chat/ensureAssetConversation";

function chatErrorUrl(code: string, detail?: string) {
  const q = new URLSearchParams();
  q.set("chatError", code);
  if (detail) q.set("detail", detail.slice(0, 500));
  return `/market?${q.toString()}`;
}

/** נקרא מטופס במסחר השוברים — יוצר/מוצא שיחה ומפנה ל-/messages או חזרה עם הודעת שגיאה. */
export async function startChatWithSeller(assetId: string, formData: FormData) {
  void formData;
  if (!assetId?.trim()) {
    console.error("[startChatWithSeller] missing assetId");
    redirect(chatErrorUrl("missing_asset"));
  }

  const r = await ensureAssetConversation(assetId.trim());

  if (!r.ok) {
    console.error("[startChatWithSeller] failed", { assetId: assetId.trim(), ...r });

    if (r.error === "unauthorized") {
      redirect(`/auth/login?next=${encodeURIComponent(`/market/${assetId.trim()}/chat`)}`);
    }
    if (r.error === "self") {
      redirect(`/dashboard/assets/${assetId.trim()}`);
    }

    redirect(chatErrorUrl(r.error, r.message));
  }

  console.log("[startChatWithSeller] redirect", r.conversationId);
  redirect(`/messages/${r.conversationId}`);
}
