import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { formatNis } from "@/lib/format/nis";
import { MarketAssetThumb } from "@/components/market/MarketAssetThumb";

export type MarketAssetCardData = {
  id: string;
  title: string;
  nominal_value: number;
  ask_price: number;
  category: string | null;
  image_path?: string | null;
  expiry?: string | null;
};

export function MarketAssetCard({ asset }: { asset: MarketAssetCardData }) {
  const nominal = Number(asset.nominal_value);
  const ask = Number(asset.ask_price);
  const hasDeal = nominal > 0 && ask < nominal;
  const saved = hasDeal ? Math.round(nominal - ask) : 0;
  const discountPct = hasDeal ? Math.round(((nominal - ask) / nominal) * 100) : 0;
  const isExpired = asset.expiry && new Date(asset.expiry) < new Date();
  const expiryLabel = asset.expiry
    ? new Date(asset.expiry).toLocaleDateString("he-IL", { day: "numeric", month: "short" })
    : null;

  return (
    <Link
      href={`/market/${asset.id}`}
      className="card-elevated group flex h-full scale-100 flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-money/30 hover:shadow-card-hover"
    >
      <MarketAssetThumb title={asset.title} imagePath={asset.image_path} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          {asset.category && (
            <span className="rounded-full bg-accent-faint/80 px-2.5 py-0.5 text-[0.65rem] font-semibold text-accent ring-1 ring-accent/15">
              {asset.category}
            </span>
          )}
          {hasDeal && (
            <span className="rounded-full bg-money/15 px-2.5 py-0.5 text-[0.65rem] font-bold text-money-dark ring-1 ring-money/25">
              חסכון {discountPct}%
            </span>
          )}
          {expiryLabel && (
            <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold ${
              isExpired ? "bg-red-50 text-red-700 ring-1 ring-red-200" : "bg-slate-100 text-ink-muted"
            }`}>
              <Calendar className="size-3" strokeWidth={2} />
              {isExpired ? "פג תוקף" : `עד ${expiryLabel}`}
            </span>
          )}
        </div>
        <h2 className="mt-2 line-clamp-2 min-h-[3rem] text-lg font-bold leading-snug text-brand-deep transition duration-200 group-hover:text-brand">
          {asset.title}
        </h2>

        <div className="mt-4 flex flex-col gap-1.5 border-t border-slate-100 pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold text-ink-faint">שווי השובר</span>
            <span className="text-base font-bold tabular-nums text-ink">{formatNis(nominal)} ₪</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold text-money-dark">מחיר מבוקש</span>
            <span className="text-xl font-extrabold tabular-nums tracking-tight text-money">{formatNis(ask)} ₪</span>
          </div>
          {hasDeal && (
            <p className="mt-1 text-center text-xs font-bold text-money-dark">
              חיסכון של {formatNis(saved)} ₪
            </p>
          )}
        </div>

        <span className="btn-secondary mt-5 flex w-full items-center justify-center gap-2 border-transparent bg-brand-faint/50 py-2.5 text-center text-sm font-semibold text-brand-deep transition duration-200 group-hover:bg-brand group-hover:text-white group-hover:shadow-md">
          פרטים וצ׳אט
          <ArrowLeft className="size-4 opacity-80 transition group-hover:-translate-x-0.5 rtl:rotate-180" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
