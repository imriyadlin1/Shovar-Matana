import Link from "next/link";
import { ShieldCheck, Gift, Coffee, Plane, ShoppingBag, Eye, EyeOff } from "lucide-react";
import { MarketAssetCard } from "@/components/market/MarketAssetCard";
import { getListedAssetsPreview } from "@/lib/market/preview";

function VaultPreview() {
  const vouchers = [
    { icon: Coffee, title: "שובר ארומה", value: "₪250", status: "פעיל", statusColor: "bg-emerald-100 text-emerald-700", iconBg: "from-amber-100 to-orange-50" },
    { icon: Plane, title: "זיכוי ישראייר", value: "₪1,200", status: "למכירה", statusColor: "bg-blue-100 text-blue-700", iconBg: "from-blue-100 to-sky-50" },
    { icon: ShoppingBag, title: "שובר זארה", value: "₪400", status: "פעיל", statusColor: "bg-emerald-100 text-emerald-700", iconBg: "from-pink-100 to-rose-50" },
  ];

  return (
    <div className="mx-auto mt-14 max-w-lg md:mt-16">
      <div className="relative rounded-3xl border border-brand/12 bg-white shadow-xl ring-1 ring-black/[0.03] overflow-hidden">
        {/* Header gradient bar */}
        <div className="bg-gradient-to-l from-brand via-brand-light to-emerald-400 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/80">האזור האישי שלכם</p>
              <p className="mt-1 text-3xl font-black tabular-nums tracking-tight text-white">₪1,850</p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Gift className="size-6 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex divide-x divide-x-reverse divide-slate-100 border-b border-slate-100 bg-gradient-to-b from-brand-faint/40 to-white text-center">
          {[
            { n: "3", label: "שוברים", icon: Gift, color: "text-brand" },
            { n: "2", label: "פעילים", icon: Eye, color: "text-emerald-600" },
            { n: "1", label: "למכירה", icon: EyeOff, color: "text-blue-600" },
          ].map((s) => (
            <div key={s.label} className="flex flex-1 flex-col items-center px-3 py-3.5">
              <s.icon className={`size-4 ${s.color} opacity-60`} strokeWidth={1.5} />
              <p className={`mt-1 text-xl font-black tabular-nums ${s.color}`}>{s.n}</p>
              <p className="text-[0.6rem] font-semibold text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Voucher list preview */}
        <div className="space-y-0 divide-y divide-slate-100/80 px-1">
          {vouchers.map((v) => (
            <div key={v.title} className="flex items-center gap-3.5 px-5 py-3.5">
              <div className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${v.iconBg} shadow-sm`}>
                <v.icon className="size-5 text-ink-muted" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{v.title}</p>
                <p className="text-xs font-bold tabular-nums text-brand-deep">{v.value}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[0.6rem] font-bold ${v.statusColor}`}>
                {v.status}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom glow */}
        <div className="bg-gradient-to-t from-emerald-50/60 via-transparent to-transparent px-6 py-3 text-center">
          <p className="text-[0.65rem] font-medium text-ink-faint">תוך דקה זה נראה ככה</p>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const previewAssets = await getListedAssetsPreview(6);

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-slate-200/60">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-emerald-50/60" aria-hidden />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_85%_60%_at_50%_-18%,rgba(21,101,192,0.16),transparent_58%)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_100%_100%,rgba(16,185,129,0.08),transparent_50%)]" />
        <div className="page-shell relative pb-20 pt-20 md:pb-28 md:pt-28">
          <h1 className="mx-auto max-w-2xl text-balance text-center text-4xl font-bold leading-[1.08] tracking-tight text-brand-deep md:text-5xl">
            יש לכם שוברים או זיכויים שלא השתמשתם בהם?
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-center text-lg font-semibold leading-relaxed text-ink">
            מרכזים את הכול במקום אחד — ורואים מה שווה להשתמש, למכור או להעביר הלאה.
          </p>
          <p className="mx-auto mt-3 max-w-md text-center text-sm font-medium text-ink-muted">
            תוך פחות מדקה תבינו מה יש לכם ביד.
          </p>

          <VaultPreview />

          <div className="mt-10 flex flex-wrap justify-center gap-3 md:mt-12">
            <Link
              href="/dashboard"
              className="btn-cta px-8 py-3.5 text-base font-bold"
            >
              בדקו מה יש לכם
            </Link>
            <Link href="/market" className="btn-secondary px-8 py-3.5 text-base font-semibold">
              ראו שוברים של אחרים
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works (single section) ── */}
      <section className="border-t border-slate-200/50 bg-gradient-to-b from-white to-blue-50/40 py-16 md:py-20">
        <div className="page-shell">
          <h2 className="text-center eyebrow">איך זה עובד?</h2>
          <ol className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "מוסיפים שוברים",
                body: "שובר מתנה, זיכוי, הטבה — מכניסים את השווי ובוחרים קטגוריה.",
                gradient: "from-brand to-blue-500",
              },
              {
                step: "2",
                title: "רואים את התמונה",
                body: "כמה שווה הכול, מה בשימוש ומה לא. הכול במסך אחד.",
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                step: "3",
                title: "משתמשים או מוכרים",
                body: "מפרסמים לאחרים, ומי שמתעניין פונה ישירות בצ׳אט.",
                gradient: "from-blue-500 to-emerald-500",
              },
            ].map((item) => (
              <li
                key={item.step}
                className="card-elevated px-7 py-7 transition duration-200 hover:-translate-y-1 hover:border-brand/20 hover:shadow-card-hover"
              >
                <span className={`flex size-9 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-sm font-black text-white shadow-sm`}>
                  {item.step}
                </span>
                <h3 className="mt-4 text-lg font-bold text-brand-deep">{item.title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-ink-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Market preview ── */}
      <section className="border-t border-slate-200/60 bg-gradient-to-b from-slate-50/80 to-emerald-50/20 py-16 md:py-20">
        <div className="page-shell">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold text-brand-deep">שוברים ממשתמשים אחרים</h2>
              <p className="mt-2 max-w-md text-sm font-medium text-ink-muted">
                אפשר למצוא שוברים במחיר נמוך יותר מהשווי שלהם.
              </p>
            </div>
            <Link href="/market" className="btn-secondary shrink-0 font-semibold">
              לכל ההצעות
            </Link>
          </div>

          {!previewAssets.length ? (
            <div className="card-elevated mt-10 flex flex-col items-center px-8 py-14 text-center">
              <p className="text-lg font-bold text-brand-deep">עדיין אין שוברים פתוחים</p>
              <p className="mt-3 max-w-sm text-sm font-medium text-ink-muted">
                כשמשתמשים יפרסמו שוברים — תראו אותם כאן.
              </p>
              <Link
                href="/dashboard"
                className="btn-cta mt-8 font-bold"
              >
                בדקו מה יש לכם
              </Link>
            </div>
          ) : (
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {previewAssets.map((a) => (
                <li key={a.id}>
                  <MarketAssetCard asset={a} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ── Trust ── */}
      <section className="py-14 md:py-16">
        <div className="page-shell">
          <div className="card-elevated flex flex-col gap-5 border-emerald-200/40 bg-gradient-to-br from-emerald-50/60 via-white to-blue-50/50 px-8 py-8 shadow-md md:flex-row md:items-start md:justify-between md:px-10 md:py-10">
            {[
              { t: "פרטיות מלאה", d: "השוברים שלכם נראים רק לכם — עד שתחליטו לפרסם.", color: "text-emerald-600" },
              { t: "בלי מתווך", d: "אתם מחליטים מה לפרסם, מתי ולמי.", color: "text-brand" },
              { t: "סגירה בצ׳אט", d: "מחיר ותנאים ביניכם — ישירות.", color: "text-teal-600" },
            ].map((x) => (
              <div key={x.t} className="flex gap-3 md:flex-1">
                <ShieldCheck className={`mt-0.5 size-5 shrink-0 ${x.color}`} strokeWidth={2} aria-hidden />
                <div>
                  <p className="font-bold text-brand-deep">{x.t}</p>
                  <p className="mt-1 text-sm font-medium text-ink-muted">{x.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
