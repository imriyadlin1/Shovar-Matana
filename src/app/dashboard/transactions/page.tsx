import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatNis } from "@/lib/format/nis";

const STATUS_LABEL: Record<string, string> = {
  pending_payment: "ממתין לתשלום",
  paid: "שולם — בנאמנות",
  code_sent: "קוד נשלח",
  completed: "הושלם",
  disputed: "בבדיקה",
  refunded: "הוחזר",
  cancelled: "בוטל",
};

const STATUS_COLOR: Record<string, string> = {
  pending_payment: "bg-amber-50 text-amber-800",
  paid: "bg-blue-50 text-blue-800",
  code_sent: "bg-indigo-50 text-indigo-800",
  completed: "bg-emerald-50 text-emerald-800",
  disputed: "bg-red-50 text-red-800",
  refunded: "bg-slate-50 text-slate-800",
  cancelled: "bg-slate-50 text-slate-500",
};

type TxRow = {
  id: string;
  asset_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  platform_fee: number;
  status: string;
  created_at: string;
  completed_at: string | null;
  assets: { title: string } | null;
};

export default async function TransactionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/dashboard/transactions");

  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, asset_id, buyer_id, seller_id, amount, platform_fee, status, created_at, completed_at, assets:asset_id (title)")
    .order("created_at", { ascending: false });

  const rows = (transactions ?? []) as unknown as TxRow[];

  const completedEarnings = rows
    .filter((t) => t.seller_id === user.id && t.status === "completed")
    .reduce((sum, t) => sum + (t.amount - t.platform_fee), 0);

  const pendingEscrow = rows
    .filter(
      (t) =>
        t.seller_id === user.id &&
        (t.status === "paid" || t.status === "code_sent"),
    )
    .reduce((sum, t) => sum + (t.amount - t.platform_fee), 0);

  return (
    <main className="page-shell py-10 pb-24 md:py-14">
      <Link href="/dashboard" className="link-back">
        חזרה לאזור אישי
      </Link>

      <h1 className="mt-6 text-2xl font-bold text-brand-deep md:text-3xl">
        עסקאות
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="card-elevated px-5 py-5">
          <p className="text-xs font-semibold text-ink-faint">
            הכנסות (לאחר עמלה)
          </p>
          <p className="mt-2 text-2xl font-black tabular-nums text-money-dark">
            {formatNis(Math.round(completedEarnings / 100))} ₪
          </p>
        </div>
        {pendingEscrow > 0 && (
          <div className="card-elevated px-5 py-5">
            <p className="text-xs font-semibold text-ink-faint">
              בנאמנות (ממתין)
            </p>
            <p className="mt-2 text-2xl font-black tabular-nums text-blue-700">
              {formatNis(Math.round(pendingEscrow / 100))} ₪
            </p>
          </div>
        )}
      </div>

      {!rows.length ? (
        <div className="card-elevated mt-10 border-dashed border-slate-300/80 bg-surface-muted/30 px-8 py-14 text-center">
          <p className="text-xl font-bold text-brand-deep">אין עסקאות עדיין</p>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-muted">
            כשתבצעו רכישה או תקבלו תשלום — זה יופיע כאן.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {rows.map((tx) => {
            const isBuyer = tx.buyer_id === user.id;
            const amountIls = Math.round(tx.amount / 100);
            const netIls = Math.round((tx.amount - tx.platform_fee) / 100);
            const assetTitle = tx.assets?.title || "שובר";

            return (
              <li
                key={tx.id}
                className="card-elevated flex items-center gap-4 px-5 py-4"
              >
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                    isBuyer ? "bg-red-50" : "bg-money-faint"
                  }`}
                >
                  {isBuyer ? (
                    <ArrowUpRight
                      className="size-4 text-red-500"
                      strokeWidth={2}
                    />
                  ) : (
                    <ArrowDownLeft
                      className="size-4 text-money"
                      strokeWidth={2}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-brand-deep">
                    {assetTitle}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-faint">
                    {isBuyer ? "רכישה" : "מכירה"} ·{" "}
                    {new Date(tx.created_at).toLocaleDateString("he-IL")}
                  </p>
                </div>
                <div className="text-left">
                  <p
                    className={`text-sm font-bold tabular-nums ${
                      isBuyer ? "text-red-600" : "text-money"
                    }`}
                  >
                    {isBuyer ? "-" : "+"}
                    {formatNis(isBuyer ? amountIls : netIls)} ₪
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[0.6rem] font-bold ${
                      STATUS_COLOR[tx.status] ?? "bg-slate-50 text-slate-500"
                    }`}
                  >
                    {STATUS_LABEL[tx.status] ?? tx.status}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
