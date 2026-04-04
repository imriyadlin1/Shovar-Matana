"use client";

import { useState } from "react";
import { CreditCard, ExternalLink, Loader2, ShieldCheck } from "lucide-react";

type Props = {
  isConnected: boolean;
  isComplete: boolean;
};

export function StripeConnectButton({ isConnected, isComplete }: Props) {
  const [loading, setLoading] = useState(false);

  if (isComplete) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-money/20 bg-money-faint/50 px-5 py-4">
        <ShieldCheck className="size-5 text-money" strokeWidth={2} />
        <div>
          <p className="text-sm font-bold text-money-dark">Stripe מחובר</p>
          <p className="text-xs text-ink-muted">
            קונים יכולים לשלם בכרטיס אשראי על השוברים שלכם.
          </p>
        </div>
      </div>
    );
  }

  async function handleConnect() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "שגיאה בחיבור ל-Stripe");
      }
    } catch {
      alert("שגיאה בחיבור לשרת");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-brand/15 bg-brand-faint/30 p-5">
      <div className="flex items-center gap-2">
        <CreditCard className="size-5 text-brand" strokeWidth={2} />
        <p className="font-bold text-brand-deep">
          {isConnected ? "השלימו חיבור Stripe" : "חברו Stripe לקבלת תשלומים"}
        </p>
      </div>
      <p className="mt-2 text-sm text-ink-muted">
        קונים ישלמו בכרטיס אשראי. הכסף מוחזק בנאמנות עד אישור קבלת הקוד —
        בטוח לשני הצדדים. עמלה: 5% בלבד.
      </p>
      <button
        type="button"
        onClick={handleConnect}
        disabled={loading}
        className="mt-4 flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-deep disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            מתחבר…
          </>
        ) : (
          <>
            <ExternalLink className="size-4" strokeWidth={2} />
            {isConnected ? "המשיכו חיבור" : "חברו Stripe"}
          </>
        )}
      </button>
    </div>
  );
}
