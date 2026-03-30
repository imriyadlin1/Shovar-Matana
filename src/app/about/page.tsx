import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "אודות · הון כלוא",
  description: "שוברים דיגיטליים, כסף תקוע והחזרת ערך — מה המוצר ולמי.",
};

export default function AboutPage() {
  return (
    <main className="page-shell pb-24 pt-12 md:pb-28 md:pt-16">
      <article className="mx-auto max-w-3xl">
        <p className="eyebrow">אודות</p>
        <h1 className="mt-3 page-hero-title">שוברים שלא מנוצלים = כסף שלא עובד בשבילכם</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-muted">
          <span className="font-semibold text-ink">הון כלוא</span> נולד מזה שרוב האנשים לא יודעים כמה שווים
          השוברים והזיכויים הדיגיטליים שלהם — וגם כשכן, אין מקום פשוט לרשום, להשוות ולהחליט מה לעשות איתם
          מול אחרים.
        </p>

        <h2 className="mt-14 section-title">מה אנחנו מנסים לפתור</h2>
        <p className="mt-4 leading-relaxed text-ink-muted">
          בשקופית: „בזבוז” שמתרחש בשקט — שוברים שפג תוקף, זיכויים שנשכחו, הצעות שאף אחד לא סגר כי אין תעודת
          זהות ברורה ל־מה יש ומה זה שווה. המוצר נותן לכם מרכז ניהול: מעלים רשומות, רואים ערך נומינלי מול מחיר
          מבוקש, ורק אז — אם בא לכם — פותחים אותן למסחר או מנהלים החלפה דרך צ׳אט.
        </p>

        <h2 className="mt-12 section-title">למי זה מתאים</h2>
        <ul className="mt-5 space-y-4 text-ink-muted">
          <li className="flex gap-3">
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" aria-hidden />
            <span>
              <strong className="text-ink">מי שצבר שוברים</strong> (אירועים, הטבות, מתנות דיגיטליות) ורוצה סדר
              במקום רשימות מפוזרות.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand" aria-hidden />
            <span>
              <strong className="text-ink">מי שמוכן למסור שובר למי שמעריך אותו</strong> — מכירה או החלפה, עם
              בירור תנאים בצ׳אט עד ששני הצדדים מרוצים.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-money" aria-hidden />
            <span>
              <strong className="text-ink">מי שרוצה להחזיר ערך כספי אמיתי אל המגירה</strong>, גם אם צעד אחר צעד,
              בלי אשליית „עוד אפליקציה”.
            </span>
          </li>
        </ul>

        <h2 className="mt-12 section-title">מה אנחנו לא</h2>
        <p className="mt-4 leading-relaxed text-ink-muted">
          לא בנק, לא בורסה ולא תיווך שמחזיק כסף. לא אנחנו קובעים אם עסקה „טובה” — אתם ובעלי המקצוע שלכם אחראים
          על משפט ומס. אנחנו נותנים שרשרת ברורה: מאגר אישי → הבנת שווי → מסחר אופציונלי → סגירה בצ׳אט.
        </p>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link href="/how-it-works" className="btn-primary">
            שלושת השלבים
          </Link>
          <Link href="/market" className="btn-secondary">
            לשוברים למסחר
          </Link>
        </div>
      </article>
    </main>
  );
}
