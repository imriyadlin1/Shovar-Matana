import { redirect } from "next/navigation";
import Link from "next/link";
import { Check, CreditCard, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StripeConnectButton } from "@/components/stripe/StripeConnectButton";

export default async function StripeDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; refresh?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/dashboard/stripe");

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_account_id, stripe_onboarding_complete")
    .eq("id", user.id)
    .single();

  let isConnected = !!profile?.stripe_account_id;
  let isComplete = !!profile?.stripe_onboarding_complete;

  if (sp.success && isConnected && !isComplete) {
    const { getStripe } = await import("@/lib/stripe/server");
    const { createServiceClient } = await import("@/lib/supabase/service");
    const stripe = getStripe();
    const account = await stripe.accounts.retrieve(profile!.stripe_account_id!);
    if (account.charges_enabled && account.payouts_enabled) {
      const svc = createServiceClient();
      await svc
        .from("profiles")
        .update({ stripe_onboarding_complete: true })
        .eq("id", user.id);
      isComplete = true;
    }
  }

  return (
    <main className="page-shell max-w-2xl py-10 pb-24 md:py-14">
      <Link href="/dashboard" className="link-back">
        חזרה לאזור אישי
      </Link>

      <h1 className="mt-6 text-2xl font-bold text-brand-deep md:text-3xl">
        חיבור תשלומים
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        חברו את חשבון Stripe שלכם כדי לקבל תשלומים מאובטחים מקונים.
      </p>

      {isComplete && sp.success && (
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-money/10 px-4 py-3 text-sm font-semibold text-money-dark">
          <Check className="size-4" strokeWidth={2.5} />
          החיבור הושלם בהצלחה!
        </div>
      )}

      <div className="mt-8">
        <StripeConnectButton isConnected={isConnected} isComplete={isComplete} />
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-surface-muted/30 p-5">
        <h3 className="font-bold text-ink">איך זה עובד?</h3>
        <ol className="mt-3 space-y-2 text-sm text-ink-muted" dir="rtl">
          <li>
            <strong>1.</strong> חברו את חשבון Stripe (חד פעמי, 2 דקות)
          </li>
          <li>
            <strong>2.</strong> פרסמו שובר → קונה לוחץ &quot;שלמו מאובטח&quot;
          </li>
          <li>
            <strong>3.</strong> הכסף מוחזק בנאמנות על ידי הפלטפורמה
          </li>
          <li>
            <strong>4.</strong> שלחו את הקוד → הקונה מאשר → הכסף אצלכם
          </li>
        </ol>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-surface-muted/30 p-5">
        <h3 className="font-bold text-ink">פרטים חשובים</h3>
        <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
          <li>• עמלת פלטפורמה: 5% מכל עסקה</li>
          <li>• העברה ישירה לחשבון הבנק שלכם</li>
          <li>• תמיכה בכל כרטיסי האשראי</li>
          <li>• מוגן על ידי Stripe — אבטחה ברמה הגבוהה ביותר</li>
        </ul>
      </div>
    </main>
  );
}
