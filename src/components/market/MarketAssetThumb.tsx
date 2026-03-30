/** תמונת רקע לכרטיס שובר — בלי קבצים חיצוניים */
export function MarketAssetThumb({ title }: { title: string }) {
  const seed = title.length % 5;
  const accents = [
    "from-brand/85 via-brand-deep to-slate-900",
    "from-brand-deep via-brand/80 to-slate-800",
    "from-money-dark/90 via-brand/70 to-slate-900",
    "from-slate-800 via-brand/75 to-accent/40",
    "from-brand via-money-dark to-slate-900",
  ];
  const grad = accents[seed] ?? accents[0];

  return (
    <div className={`relative h-36 overflow-hidden bg-slate-900 md:h-40`}>
      <div className={`absolute inset-0 bg-gradient-to-br opacity-95 ${grad}`} aria-hidden />
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M40 0L80 40L40 80L0 40Z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "56px 56px",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" aria-hidden />
      <p className="absolute bottom-3 end-4 start-4 line-clamp-2 text-start text-xs font-semibold leading-snug text-white/95 drop-shadow-sm" dir="auto">
        {title}
      </p>
    </div>
  );
}
