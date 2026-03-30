import { redirect } from "next/navigation";
import { ensureAssetConversation } from "@/lib/chat/ensureAssetConversation";

function chatErrorUrl(code: string, detail?: string) {
  const q = new URLSearchParams();
  q.set("chatError", code);
  if (detail) q.set("detail", detail.slice(0, 500));
  return `/market?${q.toString()}`;
}

/** נקודת כניסה ישירה ל-URL — אותה לוגיקה כמו startChatWithSeller בטופס. */
export default async function AssetChatEntryPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const r = await ensureAssetConversation(assetId);

  if (!r.ok) {
    console.error("[AssetChatEntryPage]", { assetId, ...r });
    if (r.error === "unauthorized") {
      redirect(`/auth/login?next=${encodeURIComponent(`/market/${assetId}/chat`)}`);
    }
    if (r.error === "self") {
      redirect(`/dashboard/assets/${assetId}`);
    }
    redirect(chatErrorUrl(r.error, r.message));
  }

  redirect(`/messages/${r.conversationId}`);
}
