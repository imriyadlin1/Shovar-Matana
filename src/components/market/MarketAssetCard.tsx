import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formatNis } from "@/lib/format/nis";
import { MarketAssetThumb } from "@/components/market/MarketAssetThumb";

export type MarketAssetCardData = {
  id: string;
  title: string;
  nominal_value: number;
  ask_price: number;
  category: string | null;
};

export function MarketAssetCard({ asset }: { asset: MarketAssetCardData }) {
  return (
    <Link
      href={`/market/${asset.id}`}
      className="card-elevated group flex h-full scale-100 flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-brand/30 hover:shadow-card-hover"
    >
      <MarketAssetThumb title={asset.title} />
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-faint">שובר למסחר</p>
        <h2 className="mt-2 line-clamp-2 min-h-[3.25rem] text-lg font-bold leading-snug text-brand-deep transition duration-200 group-hover:text-brand">
          {asset.title}
        </h2>
        {asset.category && (
          <p className="mt-3 inline-flex w-fit rounded-full bg-accent-faint/80 px-3 py-1 text-xs font-semibold text-accent ring-1 ring-accent/15">
            {asset.category}
          </p>
        )}
        <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-5">
          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-red-800/85">
            כבר שולם · על הנייר{" "}
            <span className="tabular-nums text-base font-extrabold text-ink">
              {formatNis(Number(asset.nominal_value))} ₪
            </span>
          </p>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-2xl font-extrabold tabular-nums tracking-tight text-money md:text-[1.65rem]">
              {formatNis(Number(asset.ask_price))} ₪
            </p>
            <p className="text-xs font-semibold text-ink-muted">מבוקש כעת</p>
          </div>
        </div>
        <span className="btn-secondary mt-6 flex w-full items-center justify-center gap-2 border-transparent bg-brand-faint/50 py-3 text-center text-sm font-semibold text-brand-deep transition duration-200 group-hover:bg-brand group-hover:text-white group-hover:shadow-md">
          פרטים וצ׳אט לסגירה
          <ArrowLeft className="size-4 opacity-80 transition group-hover:-translate-x-0.5 rtl:rotate-180" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
