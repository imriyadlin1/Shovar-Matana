"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Check,
  Clock,
  CreditCard,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { formatNis } from "@/lib/format/nis";

export type TransactionData = {
  id: string;
  status: string;
  amount: number;
  platform_fee: number;
  currency: string;
};

type Props = {
  transaction: TransactionData;
  isBuyer: boolean;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; Icon: typeof Check }
> = {
  pending_payment: {
    label: "ממתין לתשלום",
    color: "bg-amber-50 border-amber-200 text-amber-800",
    Icon: Clock,
  },
  paid: {
    label: "שולם — ממתין לקוד",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    Icon: ShieldCheck,
  },
  code_sent: {
    label: "הקוד נשלח — ממתין לאישור",
    color: "bg-indigo-50 border-indigo-200 text-indigo-800",
    Icon: CreditCard,
  },
  completed: {
    label: "העסקה הושלמה!",
    color: "bg-emerald-50 border-emerald-200 text-emerald-800",
    Icon: Check,
  },
  disputed: {
    label: "בבדיקה",
    color: "bg-red-50 border-red-200 text-red-800",
    Icon: AlertTriangle,
  },
  refunded: {
    label: "הוחזר",
    color: "bg-slate-50 border-slate-200 text-slate-600",
    Icon: AlertTriangle,
  },
};

export function TransactionBanner({ transaction, isBuyer }: Props) {
  const [releasing, setReleasing] = useState(false);
  const [released, setReleased] = useState(false);

  const config =
    STATUS_CONFIG[transaction.status] ?? STATUS_CONFIG.pending_payment;
  const { Icon } = config;
  const amountIls = Math.round(transaction.amount / 100);

  async function handleConfirm() {
    if (releasing || released) return;
    if (
      !confirm(
        "האם קיבלתם את קוד השובר ואתם מאשרים שחרור התשלום למוכר?",
      )
    )
      return;
    setReleasing(true);
    try {
      const res = await fetch("/api/stripe/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: transaction.id }),
      });
      const data = await res.json();
      if (data.success) {
        setReleased(true);
      } else {
        alert(data.error || "שגיאה בשחרור התשלום");
      }
    } catch {
      alert("שגיאה בחיבור לשרת");
    } finally {
      setReleasing(false);
    }
  }

  const canConfirm =
    isBuyer &&
    !released &&
    (transaction.status === "paid" || transaction.status === "code_sent");

  return (
    <div className={`rounded-2xl border p-4 ${config.color}`}>
      <div className="flex items-center gap-2">
        <Icon className="size-4" strokeWidth={2} />
        <p className="text-sm font-bold">
          {released ? "העסקה הושלמה!" : config.label}
        </p>
        <span className="mr-auto text-sm font-semibold tabular-nums">
          {formatNis(amountIls)} ₪
        </span>
      </div>

      {canConfirm && (
        <button
          type="button"
          onClick={handleConfirm}
          disabled={releasing}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-money px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {releasing ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              משחרר תשלום…
            </>
          ) : (
            <>
              <Check className="size-4" strokeWidth={2.5} />
              קיבלתי את הקוד — שחררו תשלום
            </>
          )}
        </button>
      )}

      {isBuyer && transaction.status === "paid" && !released && (
        <p className="mt-2 text-xs opacity-80">
          הכסף שלכם מוחזק בנאמנות. אשרו רק אחרי שקיבלתם את הקוד.
        </p>
      )}
      {!isBuyer && transaction.status === "paid" && (
        <p className="mt-2 text-xs opacity-80">
          הקונה שילם. שלחו את הקוד כדי שיוכל לאשר ולשחרר את הכסף אליכם.
        </p>
      )}
    </div>
  );
}
