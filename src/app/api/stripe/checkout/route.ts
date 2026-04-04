import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, calculateFee } from "@/lib/stripe/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { assetId, conversationId } = await req.json();
  if (!assetId)
    return NextResponse.json({ error: "missing assetId" }, { status: 400 });

  const { data: asset } = await supabase
    .from("assets")
    .select("id, title, ask_price, owner_id, status")
    .eq("id", assetId)
    .eq("status", "listed")
    .single();

  if (!asset) return NextResponse.json({ error: "asset not found" }, { status: 404 });
  if (asset.owner_id === user.id)
    return NextResponse.json({ error: "cannot buy own asset" }, { status: 400 });

  const { data: sellerAccepts } = await supabase.rpc("seller_accepts_stripe", {
    p_seller_id: asset.owner_id,
  });
  if (!sellerAccepts)
    return NextResponse.json({ error: "seller not connected to Stripe" }, { status: 400 });

  const amountAgorot = Math.round(Number(asset.ask_price) * 100);
  const fee = calculateFee(amountAgorot);
  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "ils",
          unit_amount: amountAgorot,
          product_data: {
            name: asset.title,
            description: `שובר דיגיטלי — ${asset.title}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      asset_id: assetId,
      buyer_id: user.id,
      seller_id: asset.owner_id,
      conversation_id: conversationId || "",
      platform_fee: fee.toString(),
    },
    success_url: `${appUrl}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/stripe/cancel?asset_id=${assetId}`,
  });

  await supabase.from("transactions").insert({
    asset_id: assetId,
    conversation_id: conversationId || null,
    buyer_id: user.id,
    seller_id: asset.owner_id,
    amount: amountAgorot,
    platform_fee: fee,
    currency: "ils",
    status: "pending_payment",
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : null,
  });

  return NextResponse.json({ url: session.url });
}
