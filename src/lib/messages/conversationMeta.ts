import type { SupabaseClient } from "@supabase/supabase-js";

export type TransactionSnapshot = {
  id: string;
  status: string;
  amount: number;
  platform_fee: number;
  currency: string;
};

export type ConversationThreadMeta = {
  peerLabel: string;
  assetTitle: string | null;
  assetId: string | null;
  askPrice: number | null;
  /** Populated only if the current user owns the asset */
  ownerVoucherCode: string | null;
  /** Active (non-cancelled/refunded) transaction for this conversation */
  activeTransaction: TransactionSnapshot | null;
  /** Whether the current user is the buyer in the active transaction */
  currentUserIsBuyer: boolean;
  /** Whether the asset seller accepts Stripe payments */
  sellerAcceptsStripe: boolean;
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
  let askPrice: number | null = null;
  let ownerVoucherCode: string | null = null;
  let sellerAcceptsStripe = false;
  if (conv?.context_type === "asset" && conv.context_id) {
    assetId = conv.context_id;
    const { data: a } = await supabase
      .from("assets")
      .select("title, voucher_code, owner_id, ask_price, status")
      .eq("id", assetId)
      .maybeSingle();
    assetTitle = a?.title ?? null;
    askPrice = a?.ask_price ? Number(a.ask_price) : null;
    if (a?.owner_id === currentUserId && a?.voucher_code) {
      ownerVoucherCode = a.voucher_code;
    }
    if (a?.owner_id) {
      const { data: accepts } = await supabase.rpc("seller_accepts_stripe", {
        p_seller_id: a.owner_id,
      });
      sellerAcceptsStripe = !!accepts;
    }
  }

  let activeTransaction: TransactionSnapshot | null = null;
  let currentUserIsBuyer = false;

  const { data: txn } = await supabase
    .from("transactions")
    .select("id, status, amount, platform_fee, currency, buyer_id")
    .eq("conversation_id", conversationId)
    .not("status", "in", '("cancelled","refunded")')
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (txn) {
    activeTransaction = {
      id: txn.id,
      status: txn.status,
      amount: txn.amount,
      platform_fee: txn.platform_fee,
      currency: txn.currency,
    };
    currentUserIsBuyer = txn.buyer_id === currentUserId;
  }

  return {
    peerLabel,
    assetTitle,
    assetId,
    askPrice,
    ownerVoucherCode,
    activeTransaction,
    currentUserIsBuyer,
    sellerAcceptsStripe,
  };
}
