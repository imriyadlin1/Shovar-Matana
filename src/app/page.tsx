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
          <p className="text-center eyebrow">כסף תקוע בשוברים שלא נגעתם בהם</p>
          <h1 className="mx-auto mt-7 max-w-3xl text-balance text-center text-4xl font-bold leading-[1.08] tracking-tight text-brand-deep md:text-5xl lg:text-[3.15rem]">
            השוברים ששכחתם עדיין שווים כסף
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-semibold leading-relaxed text-ink md:text-xl">
            כרטיס מתנה, זיכוי טיסה, קוד בהזמנה —{" "}
            <span className="font-bold text-brand-deep">הון כלוא</span> נותן לכם כספת אישית: רואים כמה כבר
            שילמתם, מה לא מומש, ומה אפשר להחזיר. מוכרים או מחליפים? רק בצ׳אט ישיר — בלי מתווך.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-3 md:gap-4">
            <Link
              href="/auth/signup?next=%2Fdashboard%2Fnew"
              className="btn-cta px-8 py-3.5 text-base font-bold"
            >
              התחילו בכספת — שובר ראשון
            </Link>
            <Link href="/market" className="btn-secondary px-8 py-3.5 text-base font-semibold">
              מה משתמשים אחרים מציעים עכשיו
            </Link>
            <Link href="/how-it-works" className="btn-primary px-8 py-3.5 text-base font-semibold shadow-md">
              איך זה עובד
            </Link>
          </div>
          <p className="mx-auto mt-12 max-w-lg text-center text-xs font-medium leading-relaxed text-ink-faint">
            לא ייעוץ פיננסי. זה כלי שמסדר כסף שכבר יצא מהכיס — ומחבר לצ׳אט כשמחליטים למסור או לקנות שובר.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200/50 bg-surface/80 py-20 md:py-24">
        <div className="page-shell">
          <h2 className="text-center eyebrow">מה עושים פה</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-2xl font-bold text-brand-deep">
            כספת אישית → החלטה → צ׳אט
          </p>
          <ol className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
            {[
              {
                step: "1",
                title: "מעלים מה ששכחתם",
                body: "כל שובר או זיכוי — רושמים כמה שילמתם עליו (על הנייר) ומה לדעתכם שווה היום. רק אצלכם, עד שתבחרו לפרסם.",
                icon: Upload,
              },
              {
                step: "2",
                title: "רואים את הסכום האבוד",
                body: "מספר אחד של „כסף שכבר יצא ולא חזר”. זה הדבר שגורם להפסיק להתעלם מהאימייל והקוד באפליקציה.",
                icon: Wallet,
              },
              {
                step: "3",
                title: "מממשים, מוכרים או מחליפים",
                body: "רוצים למכור בפחות מהנומינלי? להחליף? לסגור עם קונה? הכול מתנהל בצ׳אט ביניכם — בלי רשימה פומבית של כל שורה.",
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
          <h2 className="text-center eyebrow">למה זה חשוב</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-2xl font-bold text-brand-deep">
            כסף שכבר שילמתם — לא „אולי נזכור מחר”
          </p>
          <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4 md:gap-5">
            {[
              {
                t: "שכחה = כסף בפח",
                d: "שובר שלא נכנס לרשימה — כאילו לא קיים. רק כשהוא בכספת, הוא מתחיל לעבוד בשבילכם.",
              },
              {
                t: "כבר שילמתם בעבר",
                d: "הנומינלי הוא מה שיצא מהארנק. עד שלא מממשים או מוצאים קונה — זה הפסד שקט.",
              },
              {
                t: "החלפה אחרי שסידרתם את שלכם",
                d: "אחרי שהבנתם מה יש לכם — אפשר להציע שובר או לדבר עם מי שמציע את שלו. לא קטלוג אנונימי.",
              },
              {
                t: "הסכמה בצ׳אט",
                d: "מחיר ותנאים נסגרים ביניכם, לא על לוח מודעות גנרי.",
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
              <h2 className="eyebrow">מכספתם — אל שוברים של אנשים אחרים</h2>
              <p className="mt-3 text-2xl font-bold text-brand-deep">מישהו פרסם שובר — לפי ערך על הנייר ומחיר מבוקש</p>
              <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-ink-muted md:text-base">
                הרשימה נבנית ממשתמשים אמיתיים שבחרו לחשוף הצעה. כשאין רשומות — בנו קודם את הכספת שלכם, או חזרו
                מאוחר יותר.
              </p>
            </div>
            <Link href="/market" className="btn-secondary shrink-0 font-semibold">
              לכל ההצעות הפתוחות
            </Link>
          </div>

          {!previewAssets.length ? (
            <div className="card-elevated mt-12 flex flex-col items-center px-8 py-14 text-center md:py-16">
              <p className="text-lg font-bold text-brand-deep">עדיין אין שוברים פתוחים לצפייה</p>
              <p className="mt-3 max-w-md text-sm font-medium leading-relaxed text-ink-muted">
                זה נורמלי בהתחלה. הצעדים הבאים שלכם:
              </p>
              <ol className="mt-6 max-w-md list-decimal space-y-2 pe-5 text-start text-sm font-medium text-ink-muted">
                <li>היכנסו לכספת והוסיפו לפחות שובר אחד שלא השתמשתם בו.</li>
                <li>אם תרצו שמישהו יציע עליו — פתחו אותו לחשיפה מהדשבורד.</li>
                <li>חזרו לכאן כדי לראות מה משתמשים אחרים מציעים בפועל.</li>
              </ol>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                <Link href="/auth/signup?next=%2Fdashboard%2Fnew" className="btn-cta font-bold">
                  פתיחת כספת + שובר ראשון
                </Link>
                <Link href="/dashboard" className="btn-secondary font-semibold">
                  יש לי חשבון — לכספת
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
                t: "הכספת שלכם",
                d: "מה שאין בה — לא נספר. מה שיש — מקבל מספרים ברורים.",
              },
              {
                t: "בלי מתווך בין הצדדים",
                d: "אתם מחליטים אם ומתי לדבר עם מישהו אחר.",
              },
              {
                t: "צ׳אט לסגירה",
                d: "תנאים ומחיר — שם, לא בפיד.",
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
