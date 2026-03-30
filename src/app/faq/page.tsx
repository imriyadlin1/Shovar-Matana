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
    a: (
      <>
        מעלים שוברים למאגר האישי, רואים כמה הם שווים (נומינלי ומחיר שאתם מבקשים), ואז אם מתאים — משחררים
        הצעה למסחר. מול קונים או מחליפים פוטנציאליים — ממשיכים בצ׳אט עד שמתקדמים או חוזרים אחורה.
      </>
    ),
  },
  {
    q: "האם הכסף שלי „בטוח” במערכת?",
    a: (
      <>
        המערכת לא מחזיקה את השובר הפיזי/הקוד בשבילכם — היא מתעדת מה יש לכם ומאפשרת תקשורת. שמרו על פרטי גישה
        חזקים; מה שמוצג למסחר הוא מה שבחרתם לחשוף.
      </>
    ),
  },
  {
    q: "איך יוצרים קשר איתכם?",
    a: (
      <>
        דרך{" "}
        <Link href="/contact" className="font-semibold text-brand hover:underline">
          יצירת קשר
        </Link>
        . אם משהו טכני נשבר — כתבו מה ניסיתם ומה קיבלתם במסך.
      </>
    ),
  },
  {
    q: "מה קורה אם יש מחלוקת על עסקה?",
    a: "הצ׳אט מתעד שיחה — לא פסיקה. מחלוקות על תשלום, הקפאה או תוקף שובר הן ביניכם או עם ייעוץ משפטי. אנחנו כאן לתשתית, לא לבוררות.",
  },
  {
    q: "זה אומר שאני חייב למכור?",
    a: "לא. אפשר להשתמש רק כמאגר ערכי: לראות כמה „כסף שוכב” בצד. המסחר הוא שלב אופציונלי כשמתאים לכם.",
  },
  {
    q: "איך מסירים שובר או מפסיקים להציע אותו?",
    a: "במרכז הניהול אפשר לנהל סטטוס ופרסום. אם משהו בטופס מפריע לכם — עדיפות לשלוח משוב דרך יצירת הקשר.",
  },
];

export default function FaqPage() {
  return (
    <main className="page-shell pb-24 pt-12 md:pb-28 md:pt-16">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">שאלות נפוצות</p>
        <h1 className="mt-3 page-hero-title">לפני שמתחילים — בלי קסמים</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
          שאלות שמגיעות מאנשים שבאמת רוצים להפסיק לאבד ערך על שוברים, לא קטלוג שאלות גנרי.
        </p>

        <dl className="mt-14 space-y-5">
          {items.map((item) => (
            <div
              key={item.q}
              className="card-elevated px-6 py-7 transition duration-200 hover:shadow-card-hover sm:px-8"
            >
              <dt className="text-base font-bold text-brand-deep">{item.q}</dt>
              <dd className="mt-3 text-sm leading-relaxed text-ink-muted">{item.a}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-14 text-center text-sm text-ink-muted">
          עדיין לא ברור?{" "}
          <Link href="/contact" className="font-semibold text-brand hover:underline">
            כתבו לנו
          </Link>
        </p>
      </div>
    </main>
  );
}
