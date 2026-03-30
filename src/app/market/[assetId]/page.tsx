import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { startChatWithSeller } from "../actions";

function formatNis(n: number) {
  return new Intl.NumberFormat("he-IL", { maximumFractionDigits: 0 }).format(n);
}

export default async function MarketAssetPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const supabase = await createClient();

  const { data: asset, error } = await supabase
    .from("assets")
    .select(
      "id, title, nominal_value, ask_price, category, notes, status, published_at, contact_name",
    )
    .eq("id", assetId)
    .eq("status", "listed")
    .maybeSingle();

  if (error || !asset) notFound();

  return (
    <main className="page-shell max-w-4xl py-10 pb-24 md:py-14">
      <nav className="text-sm text-ink-muted" aria-label="מיקום בעמוד">
        <Link href="/market" className="font-medium text-brand transition hover:underline">
          מסחר שוברים
        </Link>
        <span className="mx-2 text-ink-faint">/</span>
        <span className="text-ink">{asset.title}</span>
      </nav>

      <article className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-12">
        <div className="card-elevated overflow-hidden">
          <div className="flex h-48 items-center justify-center bg-gradient-to-br from-brand-faint via-surface-muted to-brand/10 md:h-60">
            <span className="text-6xl opacity-[0.15]" aria-hidden>
              ◆
            </span>
          </div>
          <div className="p-6 md:p-10">
            <p className="eyebrow text-money">שובר פתוח למסחר</p>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-brand-deep md:text-4xl">
              {asset.title}
            </h1>
            {asset.category && (
              <p className="mt-4 inline-flex rounded-full bg-surface-muted px-3.5 py-1.5 text-xs font-medium text-ink-muted">
                {asset.category}
              </p>
            )}
            <p className="mt-8 rounded-2xl border border-red-100/90 bg-red-50/70 px-4 py-3 text-sm font-semibold text-red-950">
              מי שהחזיק את השובר — <span className="tabular-nums">כבר שילם {formatNis(Number(asset.nominal_value))} ₪</span> על הנייר.
            </p>
            <div className="mt-8 grid gap-8 border-t border-slate-100 pt-10 sm:grid-cols-2">
              <div>
                <p className="eyebrow text-red-800/80">על הנייר · כסף שכבר יצא</p>
                <p className="mt-2 text-3xl font-black tabular-nums text-ink md:text-[2.25rem]">
                  {formatNis(Number(asset.nominal_value))} ₪
                </p>
              </div>
              <div>
                <p className="eyebrow text-money">מבוקש עכשיו</p>
                <p className="mt-2 text-3xl font-black tabular-nums text-money md:text-[2.25rem]">
                  {formatNis(Number(asset.ask_price))} ₪
                </p>
              </div>
            </div>
            {asset.notes && (
              <div className="mt-10">
                <p className="eyebrow">מה כדאי לדעת</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-muted md:text-base">
                  {asset.notes}
                </p>
              </div>
            )}
            {asset.contact_name && (
              <p className="mt-8 text-sm text-ink-muted">
                איש קשר לשובר:{" "}
                <span className="font-semibold text-ink">{asset.contact_name}</span>
              </p>
            )}
            {asset.published_at && (
              <p className="mt-6 text-xs text-ink-faint">
                פורסם למסחר ב־{new Date(asset.published_at).toLocaleDateString("he-IL", { dateStyle: "long" })}
              </p>
            )}
          </div>
        </div>

        <aside className="card-elevated sticky top-28 space-y-6 p-7 shadow-card lg:p-8">
          <div>
            <h2 className="section-title text-base md:text-lg">מקדמים עסקה? זה דרך הצ׳אט</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              כאן נפתחת שיחה פרטית עם המציע — זה אותו מקום שבו בפועל מסתכמים תנאים. אם כבר דיברתם על השובר הזה,
              תמשיכו באותה שיחה.
            </p>
          </div>
          <form action={startChatWithSeller.bind(null, asset.id)}>
            <button type="submit" className="btn-cta w-full py-3.5 text-base font-semibold">
              פתיחת צ׳אט לסגירה
            </button>
          </form>
          <p className="border-t border-slate-100 pt-5 text-center text-xs leading-relaxed text-ink-faint">
            אל תשתפו כאן סיסמאות או קודי שובר מלאים. הסכמים סופיים — באחריותכם ובין הצדדים.
          </p>
        </aside>
      </article>
    </main>
  );
}
