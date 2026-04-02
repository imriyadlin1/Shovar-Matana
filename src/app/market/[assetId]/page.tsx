import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, QrCode } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatNis } from "@/lib/format/nis";
import { voucherImageUrl } from "@/lib/storage/voucherImage";
import { startChatWithSeller } from "../actions";

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
      "id, title, nominal_value, ask_price, category, notes, expiry, image_path, status, published_at, contact_name",
    )
    .eq("id", assetId)
    .eq("status", "listed")
    .maybeSingle();

  if (error || !asset) notFound();

  const nominal = Number(asset.nominal_value);
  const ask = Number(asset.ask_price);
  const hasDeal = nominal > 0 && ask < nominal;
  const discountPct = hasDeal ? Math.round(((nominal - ask) / nominal) * 100) : 0;
  const hasImage = !!asset.image_path;
  const imageUrl = hasImage ? voucherImageUrl(asset.image_path) : null;
  const isExpired = asset.expiry && new Date(asset.expiry) < new Date();

  return (
    <main className="page-shell max-w-4xl py-10 pb-24 md:py-14">
      <nav className="text-sm text-ink-muted" aria-label="מיקום בעמוד">
        <Link href="/market" className="font-medium text-brand transition hover:underline">
          שוברים ממשתמשים אחרים
        </Link>
        <span className="mx-2 text-ink-faint">/</span>
        <span className="text-ink">{asset.title}</span>
      </nav>

      <article className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-12">
        <div className="card-elevated overflow-hidden">
          {/* Image or gradient placeholder */}
          {imageUrl ? (
            <div className="relative h-52 overflow-hidden bg-slate-100 md:h-72">
              <img
                src={imageUrl}
                alt={asset.title}
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center bg-gradient-to-br from-brand-faint via-surface-muted to-brand/10 md:h-60">
              <span className="text-6xl opacity-[0.15]" aria-hidden>
                ◆
              </span>
            </div>
          )}

          <div className="p-6 md:p-10">
            <div className="flex items-center gap-2">
              <QrCode className="size-4 text-brand" strokeWidth={2} />
              <p className="eyebrow text-money">שובר דיגיטלי · סגירה בצ׳אט</p>
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-brand-deep md:text-4xl">
              {asset.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2">
              {asset.category && (
                <span className="inline-flex rounded-full bg-surface-muted px-3.5 py-1.5 text-xs font-medium text-ink-muted">
                  {asset.category}
                </span>
              )}
              {asset.expiry && (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                  isExpired ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                }`}>
                  <Calendar className="size-3" strokeWidth={2} />
                  {isExpired
                    ? `פג תוקף: ${new Date(asset.expiry).toLocaleDateString("he-IL")}`
                    : `בתוקף עד ${new Date(asset.expiry).toLocaleDateString("he-IL")}`}
                </span>
              )}
            </div>

            {hasDeal && (
              <p className="mt-6 rounded-2xl border border-money/30 bg-money-faint/90 px-4 py-3 text-sm font-bold text-money-dark">
                המחיר המבוקש נמוך ב־{discountPct}% מהשווי ({formatNis(Math.round(nominal - ask))} ₪ פחות).
                סגירה — ביניכם בצ׳אט.
              </p>
            )}

            <div className="mt-8 grid gap-8 border-t border-slate-100 pt-10 sm:grid-cols-2">
              <div>
                <p className="eyebrow text-red-800/80">שווי השובר</p>
                <p className="mt-2 text-3xl font-black tabular-nums text-ink md:text-[2.25rem]">
                  {formatNis(nominal)} ₪
                </p>
              </div>
              <div>
                <p className="eyebrow text-money">מבוקש עכשיו</p>
                <p className="mt-2 text-3xl font-black tabular-nums text-money md:text-[2.25rem]">
                  {formatNis(ask)} ₪
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
                פורסם ב־{new Date(asset.published_at).toLocaleDateString("he-IL", { dateStyle: "long" })}
              </p>
            )}
          </div>
        </div>

        <aside className="card-elevated sticky top-28 space-y-6 p-7 shadow-card lg:p-8">
          <div>
            <h2 className="section-title text-base md:text-lg">רוצים את השובר? דברו ישירות</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-ink-muted">
              שובר דיגיטלי — הקוד מועבר בצ׳אט אחרי סגירת עסקה. תסכמו מחיר, תשלום ואיך מעבירים.
            </p>
          </div>
          <form action={startChatWithSeller.bind(null, asset.id)}>
            <button type="submit" className="btn-cta w-full py-3.5 text-base font-semibold">
              פתיחת צ׳אט עם המציע
            </button>
          </form>
          <div className="rounded-2xl border border-brand/10 bg-brand-faint/30 px-4 py-3">
            <p className="flex items-center gap-2 text-xs font-bold text-brand-deep">
              <QrCode className="size-3.5" strokeWidth={2} />
              איך זה עובד?
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">
              המוכר שומר את קוד השובר / ברקוד במערכת. אחרי שמסכמים מחיר ותשלום בצ׳אט — הוא שולח את הקוד ישירות.
            </p>
          </div>
          <p className="border-t border-slate-100 pt-5 text-center text-xs font-medium leading-relaxed text-ink-faint">
            אל תשתפו קוד מלא או סיסמאות בציבור. ההסכם ביניכם.
          </p>
        </aside>
      </article>
    </main>
  );
}
