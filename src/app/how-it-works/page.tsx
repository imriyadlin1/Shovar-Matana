import type { Metadata } from "next";
import Link from "next/link";
import { ListChecks, Plus, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "איך זה עובד · שובר מתנה",
  description: "שלושה צעדים: מוסיפים שוברים, רואים מה יש, בוחרים מה לעשות.",
};

const steps = [
  {
    n: 1,
    title: "מוסיפים את השוברים שלכם",
    body: "מכניסים שוברים, זיכויים או הטבות שיש לכם.",
    icon: Plus,
  },
  {
    n: 2,
    title: "רואים מה יש לכם",
    body: "הכול מרוכז במקום אחד וברור לעין.",
    icon: Eye,
  },
  {
    n: 3,
    title: "בוחרים מה לעשות",
    body: "להשתמש, למכור או לדבר עם משתמשים אחרים.",
    icon: ListChecks,
  },
];

export default function HowItWorksPage() {
  return (
    <main className="page-shell pb-24 pt-12 md:pb-28 md:pt-16">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow text-center">איך זה עובד?</p>
        <h1 className="mx-auto mt-3 max-w-xl text-balance text-center page-hero-title">
          שלושה צעדים פשוטים
        </h1>

        <ol className="mt-14 grid gap-8 lg:grid-cols-3 lg:gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <li
                key={s.n}
                className="card-elevated relative flex flex-col px-7 py-8 pt-10 shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <span className="absolute end-6 top-6 flex size-9 items-center justify-center rounded-2xl bg-brand text-sm font-black tabular-nums text-white shadow-sm">
                  {s.n}
                </span>
                <div className="mt-4 inline-flex size-12 items-center justify-center rounded-2xl bg-accent-faint text-accent ring-1 ring-accent/20">
                  <Icon className="size-6" strokeWidth={2} aria-hidden />
                </div>
                <h2 className="mt-5 text-lg font-bold text-brand-deep">{s.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{s.body}</p>
              </li>
            );
          })}
        </ol>

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          <Link href="/dashboard" className="btn-cta px-8">
            בדקו מה יש לכם
          </Link>
          <Link href="/market" className="btn-secondary px-8">
            ראו שוברים של אחרים
          </Link>
        </div>
      </div>
    </main>
  );
}
