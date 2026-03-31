import Link from "next/link";
import { MessageCircle, ShieldCheck, Upload, Wallet } from "lucide-react";
import { MarketAssetCard } from "@/components/market/MarketAssetCard";
import { getListedAssetsPreview } from "@/lib/market/preview";

function VaultPreview() {
  return (
    <div className="card-elevated mx-auto mt-14 max-w-md overflow-hidden border-brand/15 shadow-lg md:mt-16">
      <div className="bg-gradient-to-br from-brand-faint/90 via-surface to-surface-muted/30 px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-deep/80">הכספת שלכם</p>
        <p className="mt-3 text-4xl font-black tabular-nums tracking-tight text-brand-deep">₪1,850</p>
        <p className="mt-1 text-sm font-semibold text-ink-muted">ערך שכבר שילמתם ועדיין לא מומש</p>
      </div>
      <div className="flex divide-x divide-x-reverse divide-slate-100 border-t border-slate-100 text-center">
        {[
          { n: "3", label: "שוברים בכספת" },
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
            השוברים ששכחתם עדיין שווים כסף
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-center text-lg font-semibold leading-relaxed text-ink">
            כרטיסי מתנה, זיכויים, קודים — כסף שכבר יצא מהכיס.
            <br />
            <span className="text-brand-deep">תרכזו, תראו כמה שווה, תחליטו מה לעשות.</span>
          </p>

          <VaultPreview />

          <div className="mt-10 flex flex-wrap justify-center gap-3 md:mt-12">
            <Link
              href="/auth/signup?next=%2Fdashboard%2Fnew"
              className="btn-cta px-8 py-3.5 text-base font-bold"
            >
              פתחו כספת — בחינם
            </Link>
            <Link href="/market" className="btn-secondary px-8 py-3.5 text-base font-semibold">
              ראו מה מוצע עכשיו
            </Link>
          </div>
        </div>
      </section>

      {/* ── What you get ── */}
      <section className="border-t border-slate-200/50 bg-surface/80 py-16 md:py-20">
        <div className="page-shell">
          <h2 className="text-center eyebrow">מה מקבלים אחרי הרשמה</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-2xl font-bold text-brand-deep">
            כספת אישית, מספרים ברורים, והחלטה בידיים שלכם
          </p>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Wallet, t: "סכום כולל", d: "רואים בשנייה כמה כסף תקוע בשוברים לא ממומשים." },
              { icon: Upload, t: "כספת אישית", d: "כל שובר נרשם במקום אחד — סוג, ערך, סטטוס." },
              { icon: ShieldCheck, t: "מכירה או החלפה", d: "בוחרים מה לפרסם. מה שלא — נשאר אצלכם." },
              { icon: MessageCircle, t: "סגירה בצ׳אט", d: "מחיר ותנאים נקבעים ישירות עם הצד השני." },
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

      {/* ── 3 Steps ── */}
      <section className="py-16 md:py-20">
        <div className="page-shell">
          <h2 className="text-center eyebrow">איך זה עובד</h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-2xl font-bold text-brand-deep">
            שלושה צעדים מהשכחה לפעולה
          </p>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "מעלים שוברים",
                body: "רושמים כל שובר — סוג, ערך על הנייר, מחיר מבוקש. רק אתם רואים עד שתחליטו לפרסם.",
                icon: Upload,
              },
              {
                step: "2",
                title: "רואים כמה תקוע",
                body: "סכום אחד ברור — כמה כסף כבר שילמתם ועדיין לא חזר. זה מה שמניע להחליט.",
                icon: Wallet,
              },
              {
                step: "3",
                title: "מוכרים או מחליפים",
                body: "פרסמו הצעה. קונה מתעניין? מתקדמים ישירות בצ׳אט — מחיר ותנאים ביניכם.",
                icon: MessageCircle,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.step}
                  className="card-elevated px-7 py-7 transition duration-200 hover:-translate-y-1 hover:border-brand/20 hover:shadow-card-hover"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-brand text-sm font-black text-white shadow-sm">
                      {item.step}
                    </span>
                    <div className="inline-flex size-10 items-center justify-center rounded-xl bg-accent-faint text-accent ring-1 ring-accent/20">
                      <Icon className="size-5" strokeWidth={2} aria-hidden />
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-brand-deep">{item.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-ink-muted">{item.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── Market preview ── */}
      <section className="border-t border-slate-200/60 bg-surface-muted/50 py-16 md:py-20">
        <div className="page-shell">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h2 className="eyebrow">שוברים פתוחים מהקהילה</h2>
              <p className="mt-3 text-2xl font-bold text-brand-deep">ערך על הנייר מול מחיר מבוקש</p>
              <p className="mt-2 max-w-md text-sm font-medium text-ink-muted">
                כל שובר כאן פורסם ע&quot;י משתמש אמיתי. רוצים לסגור? רק בצ׳אט ישיר.
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
                התחילו ע&quot;י בניית כספת אישית. כשמשתמשים יפרסמו — תראו אותם כאן.
              </p>
              <Link
                href="/auth/signup?next=%2Fdashboard%2Fnew"
                className="btn-cta mt-8 font-bold"
              >
                פתחו כספת
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
              { t: "הכספת שלכם", d: "פרטי ומאורגן. מה שלא בפנים — לא נספר." },
              { t: "בלי מתווך", d: "אתם מחליטים מה לפרסם, מתי ולמי." },
              { t: "סגירה בצ׳אט", d: "מחיר ותנאים ביניכם — לא על לוח מודעות." },
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
