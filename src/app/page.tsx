import Link from "next/link";
import { Eye, ListChecks, MessageCircle, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { MarketAssetCard } from "@/components/market/MarketAssetCard";
import { getListedAssetsPreview } from "@/lib/market/preview";

function VaultPreview() {
  return (
    <div className="card-elevated mx-auto mt-14 max-w-md overflow-hidden border-brand/15 shadow-lg md:mt-16">
      <p className="px-6 pt-5 text-xs font-bold uppercase tracking-[0.12em] text-brand-deep/80">
        תוך דקה זה נראה ככה
      </p>
      <div className="bg-gradient-to-br from-brand-faint/90 via-surface to-surface-muted/30 px-6 pb-5 pt-3">
        <p className="text-4xl font-black tabular-nums tracking-tight text-brand-deep">₪1,850</p>
        <p className="mt-1 text-sm font-semibold text-ink-muted">שווי כולל של השוברים שלכם</p>
      </div>
      <div className="flex divide-x divide-x-reverse divide-slate-100 border-t border-slate-100 text-center">
        {[
          { n: "3", label: "שוברים" },
          { n: "2", label: "פעילים" },
          { n: "1", label: "מוצע למכירה" },
        ].map((s) => (
          <div key={s.label} className="flex-1 px-3 py-4">
            <p className="text-xl font-black tabular-nums text-brand-deep">{s.n}</p>
            <p className="mt-0.5 text-[0.65rem] font-semibold text-ink-muted">{s.label}</p>
          </div>
        ))}
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
        <div className="hero-surface absolute inset-0 -z-10" aria-hidden />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_85%_60%_at_50%_-18%,rgba(21,101,192,0.14),transparent_58%)]" />
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
              href="/auth/signup?next=%2Fdashboard%2Fnew"
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

      {/* ── What you get ── */}
      <section className="border-t border-slate-200/50 bg-surface/80 py-16 md:py-20">
        <div className="page-shell">
          <h2 className="text-center eyebrow">מה עושים פה בפועל?</h2>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Eye, t: "רואים הכול במקום אחד", d: "כל השוברים, הזיכויים וההטבות שלכם מרוכזים יחד." },
              { icon: SlidersHorizontal, t: "מבינים מה שווה לכם", d: "כמה זה שווה ומה כדאי לעשות עם זה." },
              { icon: ListChecks, t: "מחליטים מה לעשות", d: "להשתמש, למכור או להעביר למישהו אחר." },
              { icon: MessageCircle, t: "מדברים ישירות", d: "צ׳אט פשוט מול מי שמציע או מחפש שובר." },
            ].map((x) => {
              const Icon = x.icon;
              return (
                <li key={x.t} className="card-elevated px-6 py-7">
                  <div className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-faint text-brand ring-1 ring-brand/15">
                    <Icon className="size-5" strokeWidth={2} aria-hidden />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-brand-deep">{x.t}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-ink-muted">{x.d}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 md:py-20">
        <div className="page-shell">
          <h2 className="text-center eyebrow">איך זה עובד?</h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "מוסיפים את השוברים שלכם",
                body: "מכניסים שוברים, זיכויים או הטבות שיש לכם.",
              },
              {
                step: "2",
                title: "רואים מה יש לכם",
                body: "הכול מרוכז במקום אחד וברור לעין.",
              },
              {
                step: "3",
                title: "בוחרים מה לעשות",
                body: "להשתמש, למכור או לדבר עם משתמשים אחרים.",
              },
            ].map((item) => (
              <li
                key={item.step}
                className="card-elevated px-7 py-7 transition duration-200 hover:-translate-y-1 hover:border-brand/20 hover:shadow-card-hover"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-brand text-sm font-black text-white shadow-sm">
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
      <section className="border-t border-slate-200/60 bg-surface-muted/50 py-16 md:py-20">
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
                href="/auth/signup?next=%2Fdashboard%2Fnew"
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

      {/* ── Trust strip ── */}
      <section className="py-14 md:py-16">
        <div className="page-shell">
          <div className="card-elevated flex flex-col gap-5 border-brand/10 bg-gradient-to-br from-brand-faint/50 via-surface to-accent-faint/30 px-8 py-8 shadow-md md:flex-row md:items-start md:justify-between md:px-10 md:py-10">
            {[
              { t: "הכול במקום אחד", d: "כל השוברים שלכם מרוכזים ומסודרים." },
              { t: "בלי מתווך", d: "אתם מחליטים מה לפרסם, מתי ולמי." },
              { t: "סגירה בצ׳אט", d: "מחיר ותנאים ביניכם — ישירות." },
            ].map((x) => (
              <div key={x.t} className="flex gap-3 md:flex-1">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={2} aria-hidden />
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
