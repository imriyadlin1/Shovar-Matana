import Link from "next/link";
import { MessageCircle, ShieldCheck, Upload, Wallet } from "lucide-react";
import { MarketAssetCard } from "@/components/market/MarketAssetCard";
import { getListedAssetsPreview } from "@/lib/market/preview";

export default async function HomePage() {
  const previewAssets = await getListedAssetsPreview(6);

  return (
    <main>
      <section className="relative overflow-hidden border-b border-slate-200/60">
        <div className="hero-surface absolute inset-0 -z-10" aria-hidden />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_85%_60%_at_50%_-18%,rgba(21,101,192,0.14),transparent_58%)]" />
        <div className="page-shell relative pb-24 pt-20 md:pb-32 md:pt-28">
          <p className="text-center eyebrow">שוברים · כסף שכבר שילמתם</p>
          <h1 className="mx-auto mt-7 max-w-3xl text-balance text-center text-4xl font-bold leading-[1.08] tracking-tight text-brand-deep md:text-5xl lg:text-[3.25rem]">
            תפסיקו לבזבז את מה שכבר שילמתם
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-center text-lg font-semibold leading-relaxed text-ink md:text-xl">
            <span className="font-bold text-brand-deep">הון כלוא</span> סופר את השוברים הרדומים, מזעזע את המספרים
            לעיניים — ואז אתם מחליטים: למכור, להחליף או לממש. סגירה? בצ׳אט.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-3 md:gap-4">
            <Link
              href="/auth/signup?next=%2Fdashboard%2Fnew"
              className="btn-cta px-8 py-3.5 text-base font-bold"
            >
              הוסיפו שובר שלא השתמשתם בו
            </Link>
            <Link href="/market" className="btn-secondary px-8 py-3.5 text-base font-semibold">
              מי מציע את שלו עכשיו
            </Link>
            <Link href="/how-it-works" className="btn-primary px-8 py-3.5 text-base font-semibold shadow-md">
              איך זה עובד
            </Link>
          </div>
          <p className="mx-auto mt-12 max-w-lg text-center text-xs font-medium leading-relaxed text-ink-faint">
            לא ייעוץ. לא הבטחת מחיר. רק סדר על כסף שכבר יצא — וחיבור לצ׳אט כשממשיכים.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200/50 bg-surface/80 py-20 md:py-24">
        <div className="page-shell">
          <h2 className="text-center eyebrow">שלושה צעדים</h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-2xl font-bold text-brand-deep">מספרים ברורים, בלי חוברת</p>
          <ol className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
            {[
              {
                step: "1",
                title: "זורקים פנימה מה שיש",
                body: "שובר, זיכוי, מתנה דיגיטלית — רושמים סכום על הנייר ומה אתם רוצים לקבל. טיוטה עד שאתם מוכנים.",
                icon: Upload,
              },
              {
                step: "2",
                title: "רואים כמה כסף זה",
                body: "לא „בערך”. נומינלי מול מבוקש — אחד ליד השני. זה מה שעצר את הבזבוז השקט.",
                icon: Wallet,
              },
              {
                step: "3",
                title: "פועלים או סוגרים",
                body: "מכירה, החלפה, מימוש — בצ׳אט מסגרים מחיר ותנאי. שם נגמרת עסקה, לא בעמוד שיווקי.",
                icon: MessageCircle,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.step}
                  className="card-elevated px-7 py-8 transition duration-200 hover:-translate-y-1 hover:border-brand/20 hover:shadow-card-hover md:px-8 md:py-9"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm font-black text-white shadow-sm">
                      {item.step}
                    </span>
                    <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-accent-faint text-accent ring-1 ring-accent/20">
                      <Icon className="size-5" strokeWidth={2} aria-hidden />
                    </div>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-brand-deep">{item.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-ink-muted">{item.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="page-shell">
          <h2 className="text-center eyebrow">למה זה כואב לא לעשות</h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-2xl font-bold text-brand-deep">בזבוז שאתם כבר שילמתם עליו</p>
          <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4 md:gap-5">
            {[
              {
                t: "שכחתם = הפסד",
                d: "שובר שלא במערכת = כסף שלא קיים בשבילכם. קלמפון באימייל לא מזעזע את הארנק — כן מזעזעים רשומה כאן.",
              },
              {
                t: "כבר חתמתם בעסקה",
                d: "הנומינלי הוא מה שכבר יצא. עד שלא תנצלו או תמסרו — אתם מקדמים בזבוז במקום החזר.",
              },
              {
                t: "מסחר = שלב הבא",
                d: "אחרי המאגר, מסחר הוא המשך טבעי — לא „אפליקציה חדשה”.",
              },
              {
                t: "סגירה בצ׳אט",
                d: "שם נקבעים מחיר וזמן — לא בפוסטים ציבוריים.",
              },
            ].map((x) => (
              <li key={x.t} className="card-elevated px-6 py-7 md:px-7 md:py-8">
                <h3 className="text-base font-bold text-brand-deep">{x.t}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-ink-muted">{x.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-slate-200/60 bg-surface-muted/50 py-20 md:py-24">
        <div className="page-shell">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h2 className="eyebrow">אחרי המאגר</h2>
              <p className="mt-3 text-2xl font-bold text-brand-deep">מי כבר הציע שובר — ובכמה</p>
              <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-ink-muted md:text-base">
                הסכומים למטה נמשכים מהנתונים. אין? הכניסו ראשון וחזרו — או הציצו מה אחרים מבקשים.
              </p>
            </div>
            <Link href="/market" className="btn-secondary shrink-0 font-semibold">
              לרשימה המלאה
            </Link>
          </div>

          {!previewAssets.length ? (
            <div className="card-elevated mt-12 flex flex-col items-center px-8 py-16 text-center md:py-20">
              <p className="font-bold text-brand-deep">אין עדיין הצעות פומביות</p>
              <p className="mt-3 max-w-md text-sm font-medium text-ink-muted">
                תנו למאגר שלכם לדבר ראשון — או חכו שמישהו אחר יפרסם.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/auth/signup?next=%2Fdashboard%2Fnew" className="btn-cta font-bold">
                  הוסיפו שובר שלא השתמשתם בו
                </Link>
                <Link href="/market" className="btn-secondary font-semibold">
                  לחלון המסחר
                </Link>
              </div>
            </div>
          ) : (
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {previewAssets.map((a) => (
                <li key={a.id}>
                  <MarketAssetCard asset={a} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="page-shell">
          <div className="card-elevated flex flex-col gap-6 border-brand/10 bg-gradient-to-br from-brand-faint/50 via-surface to-accent-faint/30 px-8 py-10 shadow-md md:flex-row md:items-center md:justify-between md:px-12 md:py-12">
            {[
              {
                t: "בלי תיווך כפוי",
                d: "אתם מחליטים מתי לפתוח מחיר ומתי לסגור.",
              },
              {
                t: "צ׳אט לסגירה",
                d: "לא פיד — שיחה עד כן/לא.",
              },
              {
                t: "שקופים מהר",
                d: "מה פומבי ומה ביניכם — ברור.",
              },
            ].map((x) => (
              <div key={x.t} className="flex gap-4 md:max-w-[13rem] lg:max-w-none lg:flex-1">
                <ShieldCheck className="size-5 shrink-0 text-brand" strokeWidth={2} aria-hidden />
                <div>
                  <p className="font-bold text-brand-deep">{x.t}</p>
                  <p className="mt-1 text-xs font-medium leading-relaxed text-ink-muted md:text-sm">{x.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
