import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MarketAssetCard } from "@/components/market/MarketAssetCard";
import type { MarketAssetCardData } from "@/components/market/MarketAssetCard";

function chatErrorLabel(code: string, detail?: string) {
  const labels: Record<string, string> = {
    not_found: "העמוד הזה כבר לא זמין או שאין גישה אליו.",
    not_listed: "השובר לא מוצע כרגע — לא ניתן לפתוח צ׳אט.",
    db: "משהו השתבש ביצירת השיחה. נסו שוב; אם חוזר, בדקו שהמיגרציות הורצו ב-Supabase.",
    missing_asset: "חסר מזהה שובר.",
  };
  const base = labels[code] ?? "לא ניתן להתחיל שיחה כרגע.";
  return detail ? `${base} (${detail})` : base;
}

export default async function MarketPage({
  searchParams,
}: {
  searchParams: Promise<{ chatError?: string; detail?: string }>;
}) {
  const sp = await searchParams;
  const chatError = sp.chatError;
  const detail = sp.detail;
  let assets: MarketAssetCardData[] | null = null;
  let errMsg: string | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("assets")
      .select("id, title, nominal_value, ask_price, category")
      .eq("status", "listed")
      .order("published_at", { ascending: false });

    if (error) errMsg = error.message;
    else assets = (data ?? []) as MarketAssetCardData[];
  } catch (e) {
    errMsg = e instanceof Error ? e.message : "שגיית הגדרות";
  }

  return (
    <main className="page-shell py-14 pb-24 md:py-16">
      <header className="max-w-3xl">
        <p className="eyebrow">שוברים שמשתמשים בחרו לפתוח</p>
        <h1 className="mt-3 page-hero-title">מחפשים הזדמנות מול שובר אמיתי?</h1>
        <p className="mt-5 text-base font-medium leading-relaxed text-ink-muted md:text-lg">
          כל רשומה כאן הוזנה על ידי אדם אחר לכספת שלו ואז פורסמה בהסכמתו. תראו{" "}
          <strong className="font-semibold text-ink">כמה כבר שולם על הנייר</strong> לעומת{" "}
          <strong className="font-semibold text-ink">מה הוא מבקש עכשיו</strong>
          — ככה בונים תחושת עסקה. סגירה? רק בצ׳אט איתו או איתה.
        </p>
      </header>

      {chatError && (
        <div className="alert-danger mt-10" role="alert">
          <p className="font-medium">לא נפתחה שיחה</p>
          <p className="mt-1 opacity-90">{chatErrorLabel(chatError, detail)}</p>
        </div>
      )}

      {errMsg && (
        <div className="alert-warn mt-10">
          <p className="font-medium">טעינת הרשימה נכשלה</p>
          <p className="mt-1 font-mono text-xs opacity-90">{errMsg}</p>
        </div>
      )}

      {!errMsg && !assets?.length && (
        <div className="card-elevated mt-14 flex flex-col items-center px-8 py-16 text-center md:mt-16 md:py-20">
          <h2 className="section-title">אין עדיין שוברים פתוחים להצגה</h2>
          <p className="mt-4 max-w-lg text-sm font-medium leading-relaxed text-ink-muted">
            מישהו צריך ראשון לבנות כספת ולפרסם הצעה. אם זה אתם — התחילו מהדשבורד. אם לא — חזרו אחרי שתבנו
            כספת משלכם כדי לעקוב אחרי מה שנפתח.
          </p>
          <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/dashboard/new" className="btn-cta justify-center font-bold">
              פרסמו שובר מהכספת שלכם
            </Link>
            <Link href="/dashboard" className="btn-secondary justify-center font-semibold">
              חזרה לכספת
            </Link>
          </div>
        </div>
      )}

      {!!assets?.length && (
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {assets.map((a) => (
            <li key={a.id}>
              <MarketAssetCard asset={a} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
