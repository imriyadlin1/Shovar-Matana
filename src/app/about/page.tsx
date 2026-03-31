import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "אודות · הון כלוא",
  description: "למה בנינו את הון כלוא — שוברים, ערך אבוד, והחזרת שליטה.",
};

export default function AboutPage() {
  return (
    <main className="page-shell pb-24 pt-12 md:pb-28 md:pt-16">
      <article className="mx-auto max-w-3xl">
        <p className="eyebrow">אודות</p>
        <h1 className="mt-3 page-hero-title">למה בנינו את זה</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-muted">
          לרוב האנשים יש שוברים, זיכויים וקודים שנשכחו במגירה דיגיטלית. הם כבר שילמו עליהם — אבל
          בלי מקום מסודר לנהל אותם, הכסף פשוט הולך לאיבוד.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">
          <strong className="text-ink">הון כלוא</strong> נותן כספת אישית: רושמים מה יש, רואים כמה שווה,
          ומחליטים — לממש, למכור או להחליף. מסחר קורה רק בצ׳אט ישיר, בלי מתווך.
        </p>

        <h2 className="mt-12 section-title">למי זה מתאים</h2>
        <ul className="mt-5 space-y-3 text-ink-muted">
          <li className="flex gap-3">
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" aria-hidden />
            <span><strong className="text-ink">צברתם שוברים</strong> ורוצים סדר במקום רשימות מפוזרות.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand" aria-hidden />
            <span><strong className="text-ink">מוכנים למסור שובר</strong> — מכירה או החלפה, עם סגירה בצ׳אט.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-money" aria-hidden />
            <span><strong className="text-ink">רוצים להחזיר ערך אמיתי</strong> מכסף שכבר יצא מהכיס.</span>
          </li>
        </ul>

        <h2 className="mt-12 section-title">מה אנחנו לא</h2>
        <p className="mt-4 leading-relaxed text-ink-muted">
          לא בנק, לא בורסה ולא מתווך שמחזיק כסף. לא אנחנו קובעים אם עסקה טובה — אתם מחליטים.
          אנחנו נותנים: מאגר אישי → הבנת שווי → מסחר אופציונלי → סגירה בצ׳אט.
        </p>

        <div className="mt-14 flex flex-wrap gap-4">
          <Link href="/how-it-works" className="btn-primary">
            שלושה צעדים
          </Link>
          <Link href="/market" className="btn-secondary">
            ראו מה מוצע
          </Link>
        </div>
      </article>
    </main>
  );
}
