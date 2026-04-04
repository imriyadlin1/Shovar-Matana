import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getStripe } from "@/lib/stripe/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { transactionId } = await req.json();
  if (!transactionId)
    return NextResponse.json({ error: "missing transactionId" }, { status: 400 });

  const { data: tx } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", transactionId)
    .eq("buyer_id", user.id)
    .single();

  if (!tx) return NextResponse.json({ error: "transaction not found" }, { status: 404 });
  if (tx.status !== "paid" && tx.status !== "code_sent") {
    return NextResponse.json(
      { error: `cannot release from status: ${tx.status}` },
      { status: 400 },
    );
  }

  const svc = createServiceClient();
  const { data: seller } = await svc
    .from("profiles")
    .select("stripe_account_id")
    .eq("id", tx.seller_id)
    .single();

  if (!seller?.stripe_account_id) {
    return NextResponse.json(
      { error: "seller stripe account not found" },
      { status: 500 },
    );
  }

  const stripe = getStripe();
  const sellerAmount = tx.amount - tx.platform_fee;

  const transfer = await stripe.transfers.create({
    amount: sellerAmount,
    currency: tx.currency,
    destination: seller.stripe_account_id,
    transfer_group: tx.id,
    metadata: { transaction_id: tx.id, asset_id: tx.asset_id },
  });

  await svc
    .from("transactions")
    .update({
      status: "completed",
      stripe_transfer_id: transfer.id,
      completed_at: new Date().toISOString(),
    })
    .eq("id", tx.id);

  await svc
    .from("assets")
    .update({ status: "sold", sold_at: new Date().toISOString() })
    .eq("id", tx.asset_id);

  return NextResponse.json({ success: true });
}
