import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY env var");
  _stripe = new Stripe(key);
  return _stripe;
}

export const PLATFORM_FEE_PERCENT = 5;

export function calculateFee(amountAgorot: number): number {
  return Math.round((amountAgorot * PLATFORM_FEE_PERCENT) / 100);
}
