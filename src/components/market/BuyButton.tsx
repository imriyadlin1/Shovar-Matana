"use client";

import { useState } from "react";
import { CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { formatNis } from "@/lib/format/nis";

type Props = {
  assetId: string;
  askPrice: number;
  conversationId?: string;
};

export function BuyButton({ assetId, askPrice, conversationId }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId, conversationId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "שגיאה ביצירת התשלום");
      }
    } catch {
      alert("שגיאה בחיבור לשרת");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleBuy}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-money px-5 py-3.5 text-base font-bold text-white shadow-md transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            מעבד…
          </>
        ) : (
          <>
            <CreditCard className="size-5" strokeWidth={2} />
            שלמו {formatNis(Math.round(askPrice))} ₪ מאובטח
          </>
        )}
      </button>
      <div className="flex items-center justify-center gap-1.5 text-xs text-ink-faint">
        <ShieldCheck className="size-3.5 text-money" strokeWidth={2} />
        <span>הכסף מוחזק בנאמנות עד שתאשרו קבלת הקוד</span>
      </div>
    </div>
  );
}
