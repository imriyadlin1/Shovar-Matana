import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ConversationChat } from "@/components/chat/ConversationChat";
import { PaymentMethodPicker } from "@/components/chat/PaymentMethodPicker";
import { SendVoucherCode } from "@/components/chat/SendVoucherCode";
import { TransactionBanner } from "@/components/chat/TransactionBanner";
import { BuyButton } from "@/components/market/BuyButton";
import { getConversationThreadMeta } from "@/lib/messages/conversationMeta";
import { markConversationRead } from "@/lib/messages/markRead";
import { createClient } from "@/lib/supabase/server";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(
      `/auth/login?next=${encodeURIComponent(`/messages/${conversationId}`)}`,
    );
  }

  const { data: part } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!part) notFound();

  const [meta, { data: messages }] = await Promise.all([
    getConversationThreadMeta(supabase, conversationId, user.id),
    supabase
      .from("messages")
      .select("id, body, sender_id, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true }),
    markConversationRead(conversationId),
  ]);

  const showBuyButton =
    meta.sellerAcceptsStripe &&
    meta.assetId &&
    meta.askPrice &&
    !meta.activeTransaction &&
    !meta.ownerVoucherCode;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-4xl flex-col py-4 md:py-6">
      <Link href="/messages" className="link-back md:hidden">
        חזרה לרשימת הצ׳אטים
      </Link>

      <header className="mt-6 rounded-3xl border border-slate-200/80 bg-surface px-6 py-6 shadow-card md:mt-2 md:px-8 md:py-7">
        <p className="eyebrow">סגירת עסקה</p>
        <h1 className="mt-2 text-xl font-bold text-brand-deep md:text-2xl">
          {meta.peerLabel}
        </h1>
        {meta.assetTitle && meta.assetId && (
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            נוגע לשובר:{" "}
            <Link
              href={`/market/${meta.assetId}`}
              className="font-semibold text-brand transition hover:text-brand-deep hover:underline"
            >
              {meta.assetTitle}
            </Link>
          </p>
        )}

        <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4">
          {meta.activeTransaction && (
            <TransactionBanner
              transaction={meta.activeTransaction}
              isBuyer={meta.currentUserIsBuyer}
            />
          )}

          {showBuyButton && (
            <BuyButton
              assetId={meta.assetId!}
              askPrice={meta.askPrice!}
              conversationId={conversationId}
            />
          )}

          {!meta.activeTransaction && (
            <PaymentMethodPicker conversationId={conversationId} />
          )}

          {meta.ownerVoucherCode && (
            <SendVoucherCode
              conversationId={conversationId}
              voucherCode={meta.ownerVoucherCode}
            />
          )}
        </div>
      </header>

      <ConversationChat
        conversationId={conversationId}
        currentUserId={user.id}
        initialMessages={messages ?? []}
      />
    </main>
  );
}
