import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("[stripe-webhook] verification failed:", msg);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const svc = createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null;

      await svc
        .from("transactions")
        .update({
          status: "paid",
          stripe_payment_intent_id: paymentIntentId,
        })
        .eq("stripe_checkout_session_id", session.id);
      break;
    }

    case "account.updated": {
      const account = event.data.object;
      if (account.charges_enabled && account.payouts_enabled) {
        await svc
          .from("profiles")
          .update({ stripe_onboarding_complete: true })
          .eq("stripe_account_id", account.id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
