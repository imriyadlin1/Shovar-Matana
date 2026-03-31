import Link from "next/link";
import { redirect } from "next/navigation";
import { FileEdit, LayoutGrid, Layers, TrendingDown, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatNis } from "@/lib/format/nis";

const STATUS_LABEL: Record<string, string> = {
  draft: "בכספת בלבד",
  listed: "מוצג לאחרים",
  sold: "נסגר",
};

type AssetRow = {
  id: string;
  title: string;
  nominal_value: number | string;
  ask_price: number | string;
  status: string;
  created_at: string;
  sold_at: string | null;
};

function num(v: number | string): number {
  return typeof v === "number" ? v : parseFloat(String(v)) || 0;
}

function startOfLocalDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ forbidden?: string }>;
}) {
  const sp = await searchParams;
  const adminForbidden = sp.forbidden === "admin";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/dashboard");
  }

  const { data: assets, error } = await supabase
    .from("assets")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="page-shell py-12 pb-20">
        <div className="alert-danger max-w-2xl">
          <p className="font-semibold">לא נטענה הכספת</p>
          <p className="mt-2 text-sm opacity-90">
            בדקו חיבור ל-Supabase ושהמיגרציות הורצו. אם הבעיה נמשכת — עיינו בלוגים.
          </p>
          <code className="mt-4 block rounded-xl bg-red-100/50 px-3 py-2 text-xs text-red-950">
            {error.message}
          </code>
        </div>
      </main>
    );
  }

  const rows = (assets ?? []) as AssetRow[];
  const listed = rows.filter((a) => a.status === "listed").length;
  const draft = rows.filter((a) => a.status === "draft").length;

  const totalPaidNominal = rows.reduce((s, a) => s + num(a.nominal_value), 0);
  const totalAskActive = rows.filter((a) => a.status !== "sold").reduce((s, a) => s + num(a.ask_price), 0);

  const todayStart = startOfLocalDay(new Date());
  const addedToday = rows.filter((a) => new Date(a.created_at).getTime() >= todayStart).length;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const soldAll = rows.filter((a) => a.status === "sold").length;
  const soldThisWeek = rows.filter(
    (a) => a.status === "sold" && a.sold_at && new Date(a.sold_at) >= weekAgo,
  ).length;

  const metricClass =
    "card-elevated group relative overflow-hidden p-6 transition duration-200 hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-card-hover md:p-7";

  return (
    <main className="page-shell py-12 pb-24 md:py-16">
      {adminForbidden && (
        <div className="alert-warn mb-10" role="status">
          <p className="font-medium">גישה לניהול המערכת נחסמה</p>
          <p className="mt-1 text-sm opacity-95">
            החשבון שלכם אינו אדמין — הופניתם ללוח הרגיל.
          </p>
        </div>
      )}
      <header className="max-w-2xl">
        <p className="eyebrow">סקירה כספית אישית</p>
        <h1 className="mt-3 page-hero-title">כספת השוברים שלכם</h1>
        <p className="mt-4 text-sm font-medium leading-relaxed text-ink-muted md:text-base">
          כאן מרוכז <span className="text-ink">כל הכסף שכבר יצא על שוברים וזיכויים</span> — מה שמומש, מה שעדיין
          „יושן”, ומה פתוח למסירה או להחלפה. מחוברים כ־
          <span className="font-semibold text-brand-deep">{user.email}</span>
        </p>
      </header>

      <section className="mt-10">
        <div className="card-elevated relative overflow-hidden border-money/25 bg-gradient-to-br from-money-faint/90 via-surface to-brand-faint/40 p-8 shadow-card-hover md:p-10">
          <div className="absolute end-0 top-0 size-32 rounded-full bg-money/10 blur-2xl" aria-hidden />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-money-dark">
                <Wallet className="size-3.5" strokeWidth={2} aria-hidden />
                סכום על הנייר · מה שכבר שילמתם בשוברים
              </p>
              <p className="mt-4 text-4xl font-black tabular-nums tracking-tight text-money-dark md:text-[2.75rem]">
                {formatNis(Math.round(totalPaidNominal))}
                <span className="ms-2 text-2xl font-extrabold text-money">₪</span>
              </p>
              <p className="mt-3 max-w-lg text-sm font-medium leading-relaxed text-ink-muted">
                זה בסיס התזכורת: לא „יתרה עתידית”, אלא כסף שכבר הלך מהחשבון שלכם על מוצרים שלא נוצלו. ככל
                שהמספר גבוה יותר — יותר מוטב לארגן ולהחליט מה לעשות עם כל פריט.
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-slate-200/80 bg-surface/95 px-6 py-5 text-start shadow-sm md:text-end">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                סכום מבוקש (שוברים פעילים שלא נסגרו)
              </p>
              <p className="mt-2 text-2xl font-extrabold tabular-nums text-brand-deep">
                {formatNis(Math.round(totalAskActive))} ₪
              </p>
              <p className="mt-1 text-xs text-ink-muted">מה שהגדרתם כיום כמחיר מבוקש אצלכם</p>
            </div>
          </div>
        </div>
      </section>

      {rows.length > 0 && (
        <div className="mt-6 grid gap-4 rounded-3xl border border-slate-200/80 bg-surface-muted/50 px-5 py-4 md:grid-cols-3 md:gap-3 md:px-6 md:py-5">
          <div className="flex flex-col gap-1 border-slate-200/70 pb-4 md:border-e md:pb-0 md:pe-4">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-ink-faint">היום</p>
            <p className="text-lg font-black tabular-nums text-brand-deep">+{addedToday}</p>
            <p className="text-xs font-medium text-ink-muted">שוברים נוספו לכספת</p>
          </div>
          <div className="flex flex-col gap-1 border-slate-200/70 pb-4 md:border-e md:pb-0 md:pe-4">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-ink-faint">השבוע</p>
            <p className="text-lg font-black tabular-nums text-brand-deep">{soldThisWeek}</p>
            <p className="text-xs font-medium text-ink-muted">סגירות שסומנו בחשבון</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-ink-faint">מצטבר</p>
            <p className="text-lg font-black tabular-nums text-brand-deep">{soldAll}</p>
            <p className="text-xs font-medium text-ink-muted">סה״כ פריטים שסומנו כנסגרו</p>
          </div>
        </div>
      )}

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        <div className={metricClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">בכספת</p>
              <p className="mt-3 text-3xl font-extrabold tabular-nums tracking-tight text-brand-deep md:text-[2rem]">
                {rows.length}
              </p>
              <p className="mt-1 text-xs font-medium text-ink-faint">שוברים שתיעדתם</p>
              <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-red-700/90">
                <TrendingDown className="size-3.5 shrink-0" aria-hidden />
                כל שורה = כסף שכבר שילמתם
              </p>
            </div>
            <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-faint text-brand shadow-sm ring-1 ring-brand/10 transition group-hover:scale-105">
              <Layers className="size-5" strokeWidth={2} aria-hidden />
            </span>
          </div>
        </div>
        <div className={metricClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow text-money">מוצגים החוצה</p>
              <p className="mt-3 text-3xl font-extrabold tabular-nums tracking-tight text-money md:text-[2rem]">
                {listed}
              </p>
              <p className="mt-1 text-xs font-medium text-ink-faint">מישהו אחר יכול להציע עליהם</p>
            </div>
            <span className="flex size-11 items-center justify-center rounded-2xl bg-money-faint text-money shadow-sm ring-1 ring-money/15 transition group-hover:scale-105">
              <LayoutGrid className="size-5" strokeWidth={2} aria-hidden />
            </span>
          </div>
        </div>
        <div className={metricClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">רק אצלכם</p>
              <p className="mt-3 text-3xl font-extrabold tabular-nums tracking-tight text-ink md:text-[2rem]">
                {draft}
              </p>
              <p className="mt-1 text-xs font-medium text-ink-faint">עדיין לא גלויים לאחרים</p>
            </div>
            <span className="flex size-11 items-center justify-center rounded-2xl bg-surface-muted text-ink-muted shadow-sm ring-1 ring-slate-200/90 transition group-hover:scale-105">
              <FileEdit className="size-5" strokeWidth={2} aria-hidden />
            </span>
          </div>
        </div>
      </div>

      <section className="mt-14 md:mt-16">
        <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-title">השוברים בכספת</h2>
            <p className="mt-2 text-sm font-medium text-ink-muted">
              עדכנו מחיר מבוקש או פתחו לחשיפה — המשך מול קונים רק בצ׳אט
            </p>
          </div>
          <Link href="/dashboard/new" className="btn-cta w-full shrink-0 justify-center text-center sm:w-auto">
            + הוספת שובר לכספת
          </Link>
        </div>
        {!rows.length ? (
          <div className="card-elevated mt-8 border-dashed border-slate-300/80 bg-surface-muted/30 px-8 py-12 text-center shadow-sm md:px-10 md:py-14">
            <p className="text-xl font-bold text-brand-deep">הכספת ריקה — עדיין אין כסף מסודר כאן</p>
            <p className="mx-auto mt-4 max-w-md text-sm font-medium leading-relaxed text-ink-muted">
              חפשו באימייל, באפליקציות ובחשבונות: כל שובר או זיכוי שלא מימשתם. שורה אחת תראה לכם מיד כמה
              „נעלם” מהרדאר.
            </p>
            <ol className="mx-auto mt-8 max-w-md list-decimal space-y-2 pe-5 text-start text-sm font-medium text-ink md:text-base">
              <li>לחצו על הכפתור למטה.</li>
              <li>רשמו מה יש (למשל גיפט קארד) וכמה שילמתם עליו.</li>
              <li>חזרו לכאן — התמונה הכספית תתעדכן מיד.</li>
            </ol>
            <Link href="/dashboard/new" className="btn-cta mx-auto mt-10 inline-flex min-w-[16rem] justify-center font-bold">
              הוספת שובר ראשון לכספת
            </Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {rows.map((a) => (
              <li
                key={a.id}
                className="card-elevated flex flex-wrap items-center justify-between gap-4 px-5 py-5 transition duration-200 hover:border-money/25 hover:shadow-card-hover md:px-7"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-brand-deep">{a.title}</p>
                  <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    <p className="text-xl font-extrabold tabular-nums text-money">
                      {formatNis(Math.round(num(a.nominal_value)))}{" "}
                      <span className="text-sm font-bold text-ink-muted">₪ על הנייר</span>
                    </p>
                    <p className="text-sm font-semibold tabular-nums text-brand-deep">
                      מבוקש כעת {formatNis(Math.round(num(a.ask_price)))} ₪
                    </p>
                    <span className="inline-flex rounded-lg bg-surface-muted px-2.5 py-0.5 text-xs font-bold text-ink-muted">
                      {STATUS_LABEL[a.status] ?? a.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-medium text-red-800/80">כסף שכבר שולם · עדיין לא מומש במלואו</p>
                </div>
                <Link
                  href={`/dashboard/assets/${a.id}`}
                  className="btn-secondary border-transparent bg-brand-faint/50 px-4 py-2 text-sm font-bold text-brand-deep transition hover:bg-brand hover:text-white"
                >
                  ניהול
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
