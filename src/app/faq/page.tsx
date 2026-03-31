import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "שאלות נפוצות · הון כלוא",
  description: "שוברים דיגיטליים, מסחר וצ׳אט — תשובות ישרות.",
};

type Qa = { q: string; a: ReactNode };

const items: Qa[] = [
  {
    q: "בקצרה: מה הזרימה?",
    a: "מעלים שוברים לכספת → רואים כמה שווה → מחליטים: לממש, למכור או להחליף → סוגרים בצ׳אט.",
  },
  {
    q: "איך אני יודע שהשובר אמיתי?",
    a: "כל שובר מוזן ע״י בעליו. לפני סגירה — בקשו לראות קוד או אישור תוקף בצ׳אט. תמיד תוודאו פרטים לפני שמסכימים.",
  },
  {
    q: "מה כדאי לבדוק לפני קנייה?",
    a: "תוקף השובר, תנאי מימוש, וסכום בפועל. אל תעבירו תשלום לפני שווידאתם — כל הפרטים מתבררים בצ׳אט.",
  },
  {
    q: "איך הצ׳אט עובד?",
    a: "כשמצאתם שובר שמעניין אתכם — פותחים שיחה ישירה עם המציע. מחיר, תנאים והעברה — הכל ביניכם.",
  },
  {
    q: "הכסף שלי בטוח?",
    a: "המערכת לא מחזיקה כסף או קודי שוברים. היא מתעדת מה יש לכם ומחברת ביניכם — השאר בידיים שלכם.",
  },
  {
    q: "אני חייב למכור?",
    a: "לא. הכספת עובדת גם כרשימה אישית. המסחר אופציונלי — רק כשזה מתאים לכם.",
  },
  {
    q: "איך יוצרים קשר אתכם?",
    a: (
      <>
        דרך{" "}
        <Link href="/contact" className="font-semibold text-brand hover:underline">
          יצירת קשר
        </Link>
        . אם משהו לא עובד — ספרו מה ניסיתם ומה ראיתם.
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <main className="page-shell pb-24 pt-12 md:pb-28 md:pt-16">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">שאלות נפוצות</p>
        <h1 className="mt-3 page-hero-title">שאלות ותשובות</h1>

        <dl className="mt-12 space-y-4">
          {items.map((item) => (
            <div
              key={item.q}
              className="card-elevated px-6 py-6 transition duration-200 hover:shadow-card-hover sm:px-8"
            >
              <dt className="text-base font-bold text-brand-deep">{item.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-muted">{item.a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 card-elevated border-money/15 bg-money/5 px-6 py-5 text-center sm:px-8">
          <p className="text-sm font-semibold text-money-dark">
            תמיד וודאו פרטים לפני סגירת עסקה. המערכת מחברת ביניכם — האחריות היא שלכם.
          </p>
        </div>

        <p className="mt-10 text-center text-sm text-ink-muted">
          עדיין לא ברור?{" "}
          <Link href="/contact" className="font-semibold text-brand hover:underline">
            כתבו לנו
          </Link>
        </p>
      </div>
    </main>
  );
}
