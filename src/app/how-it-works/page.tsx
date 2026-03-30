import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Upload, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "איך זה עובד · הון כלוא",
  description: "מעלים שוברים, רואים שווי, מחליטים — מכירה, החלפה או שימוש, עד סגירה בצ׳אט.",
};

const steps = [
  {
    n: 1,
    title: "מעלים שוברים למאגר",
    body: "במרכז הניהול נרשמים כל אחד: מה זה, כמה שווה על הנייר, ובכמה אתם מוכנים לנהל את זה מול אחרים. עד שלא תפרסמו — זה נשאר אצלכם.",
    icon: Upload,
  },
  {
    n: 2,
    title: "רואים מה בפנים — בכסף",
    body: "במקום תחושה כללית של „יש משהו”: סכומים ברורים, השוואה מהירה, החלטה אם בכלל כדאי להמשיך למסחר או להשתמש בעצמכם.",
    icon: Wallet,
  },
  {
    n: 3,
    title: "מחליטים, ואז סוגרים בצ׳אט",
    body: "מכירה בהנחה, החלפה שווה ערך או סיוע במימוש — התקדמות אמיתית קורית בצ׳אט, שם מסכמים תנאים בין אנשים, לא מול בוט.",
    icon: MessageCircle,
  },
];

export default function HowItWorksPage() {
  return (
    <main className="page-shell pb-24 pt-12 md:pb-28 md:pt-16">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow text-center">איך זה עובד</p>
        <h1 className="mx-auto mt-3 max-w-2xl text-balance text-center page-hero-title">
          מהשכחה לשובר פעיל — בשלוש נקודות
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-center text-base leading-relaxed text-ink-muted">
          אותו מסלול בכל מקום באתר: מאגר → הכרת שווי → פעולה (כולל מסחר) → סגירה בצ׳אט.
        </p>

        <ol className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <li
                key={s.n}
                className="card-elevated relative flex flex-col px-7 py-8 pt-10 shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <span className="absolute end-6 top-6 flex h-9 w-9 items-center justify-center rounded-2xl bg-brand text-sm font-black tabular-nums leading-none text-white shadow-sm">
                  {s.n}
                </span>
                <div className="mt-6 inline-flex size-12 items-center justify-center rounded-2xl bg-accent-faint text-accent ring-1 ring-accent/20">
                  <Icon className="size-6" strokeWidth={2} aria-hidden />
                </div>
                <h2 className="mt-5 text-lg font-bold text-brand-deep">{s.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{s.body}</p>
              </li>
            );
          })}
        </ol>

        <div className="mt-16 flex flex-wrap justify-center gap-4">
          <Link href="/auth/signup" className="btn-cta px-8">
            פתיחת מאגר
          </Link>
          <Link href="/market" className="btn-secondary px-8">
            לראות מה מוצע למסחר
          </Link>
        </div>
      </div>
    </main>
  );
}
