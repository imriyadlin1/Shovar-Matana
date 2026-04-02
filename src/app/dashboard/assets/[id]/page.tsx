import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Calendar, Eye, EyeOff, Pencil, QrCode, Share2, StickyNote, Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatNis } from "@/lib/format/nis";
import { voucherImageUrl } from "@/lib/storage/voucherImage";
import { AssetActions } from "@/components/dashboard/AssetActions";
import { CopyLinkButton } from "@/components/shared/CopyLinkButton";

const STATUS_LABEL: Record<string, string> = {
  draft: "רק אצלכם",
  listed: "מוצג לאחרים",
  sold: "נסגר",
};

const STATUS_COLOR: Record<string, string> = {
  draft: "bg-slate-100 text-ink-muted",
  listed: "bg-money/15 text-money-dark",
  sold: "bg-brand-faint text-brand-deep",
};

type Props = { params: Promise<{ id: string }> };

export default async function AssetDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: asset, error } = await supabase
    .from("assets")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (error || !asset) notFound();

  const nominal = Number(asset.nominal_value) || 0;
  const ask = Number(asset.ask_price) || 0;
  const hasImage = !!asset.image_path;
  const imageUrl = hasImage ? voucherImageUrl(asset.image_path) : null;
  const isExpired = asset.expiry && new Date(asset.expiry) < new Date();

  return (
    <main className="page-shell max-w-3xl py-10 pb-24 md:py-14">
      <Link href="/dashboard" className="link-back">
        ← חזרה לשוברים שלכם
      </Link>

      <div className="mt-8 card-elevated overflow-hidden">
        {/* Image or gradient */}
        {imageUrl ? (
          <div className="relative h-48 overflow-hidden bg-slate-100 md:h-64">
            <img
              src={imageUrl}
              alt={asset.title}
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <div className="flex h-36 items-center justify-center bg-gradient-to-br from-brand-faint via-surface-muted to-brand/10 md:h-44">
            <Tag className="size-12 text-brand/20" strokeWidth={1} />
          </div>
        )}

        <div className="p-6 md:p-8">
          {/* Title + status */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-brand-deep md:text-3xl">{asset.title}</h1>
              {asset.category && (
                <p className="mt-2 inline-flex rounded-full bg-accent-faint/80 px-3 py-1 text-xs font-semibold text-accent ring-1 ring-accent/15">
                  {asset.category}
                </p>
              )}
            </div>
            <span className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${STATUS_COLOR[asset.status] ?? "bg-slate-100 text-ink-muted"}`}>
              {asset.status === "listed" && <Eye className="mb-px mr-1 inline size-3" />}
              {asset.status === "draft" && <EyeOff className="mb-px mr-1 inline size-3" />}
              {STATUS_LABEL[asset.status] ?? asset.status}
            </span>
          </div>

          {/* Value cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-surface-muted/40 px-5 py-4">
              <p className="text-xs font-semibold text-ink-faint">שווי השובר</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-ink">{formatNis(nominal)} ₪</p>
            </div>
            <div className="rounded-2xl border border-money/20 bg-money-faint/40 px-5 py-4">
              <p className="text-xs font-bold text-money-dark">מחיר מבוקש</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-money">{formatNis(ask)} ₪</p>
            </div>
          </div>

          {/* Voucher code (owner only) */}
          {asset.voucher_code && (
            <div className="mt-6 rounded-2xl border border-brand/15 bg-brand-faint/30 p-5">
              <div className="flex items-center gap-2">
                <QrCode className="size-4 text-brand" strokeWidth={2} />
                <p className="text-xs font-bold text-brand-deep">קוד השובר</p>
              </div>
              <p className="mt-2 select-all font-mono text-lg font-bold tracking-wider text-brand-deep" dir="ltr">
                {asset.voucher_code}
              </p>
              <p className="mt-2 text-xs text-ink-faint">
                הקוד נראה רק לכם. שתפו אותו עם הקונה בצ׳אט כשתסגרו עסקה.
              </p>
            </div>
          )}

          {/* Expiry */}
          {asset.expiry && (
            <div className={`mt-4 flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-medium ${
              isExpired
                ? "border-red-200 bg-red-50/80 text-red-800"
                : "border-slate-100 bg-surface-muted/40 text-ink-muted"
            }`}>
              <Calendar className="size-4 shrink-0" strokeWidth={2} />
              <span>
                {isExpired ? "פג תוקף: " : "בתוקף עד: "}
                {new Date(asset.expiry).toLocaleDateString("he-IL", { dateStyle: "long" })}
              </span>
            </div>
          )}

          {/* Notes */}
          {asset.notes && (
            <div className="mt-4 rounded-2xl border border-slate-100 bg-surface-muted/40 p-5">
              <div className="flex items-center gap-2">
                <StickyNote className="size-4 text-ink-faint" strokeWidth={2} />
                <p className="text-xs font-bold text-ink-muted">הערות</p>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">
                {asset.notes}
              </p>
            </div>
          )}

          {/* Dates */}
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-ink-faint">
            <span>נוצר: {new Date(asset.created_at).toLocaleDateString("he-IL")}</span>
            {asset.published_at && (
              <span>פורסם: {new Date(asset.published_at).toLocaleDateString("he-IL")}</span>
            )}
            {asset.sold_at && (
              <span>נסגר: {new Date(asset.sold_at).toLocaleDateString("he-IL")}</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href={`/dashboard/assets/${asset.id}/edit`}
          className="flex items-center gap-2 rounded-2xl border border-brand/20 bg-brand-faint/40 px-5 py-3 text-sm font-bold text-brand-deep transition hover:bg-brand hover:text-white"
        >
          <Pencil className="size-4" strokeWidth={2} />
          עריכת שובר
        </Link>
        {asset.status === "listed" && (
          <CopyLinkButton path={`/market/${asset.id}`} />
        )}
      </div>
      <div className="mt-3">
        <AssetActions assetId={asset.id} currentStatus={asset.status} />
      </div>
    </main>
  );
}
