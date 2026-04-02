import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Eye, MessageCircle, QrCode } from "lucide-react";

export const metadata: Metadata = {
  title: "איך זה עובד · שובר מתנה",
  description: "שלושה צעדים: מוסיפים שובר דיגיטלי עם הקוד, רואים מה יש, מוכרים בצ׳אט.",
};

const steps = [
  {
    n: 1,
    title: "שומרים את השובר הדיגיטלי",
    body: "מכניסים את קוד השובר, ברקוד או מספר מתנה — בוחרים קטגוריה, שווי ומחיר. הקוד נשמר בפרטיות.",
    icon: QrCode,
  },
  {
    n: 2,
    title: "רואים מה יש לכם",
    body: "כל השוברים הדיגיטליים מרוכזים במסך אחד — שווי, תוקף וסטטוס.",
    icon: Eye,
  },
  {
    n: 3,
    title: "מוכרים ישירות בצ׳אט",
    body: "מפרסמים, מי שרוצה פותח צ׳אט — מסכמים מחיר ושולחים את הקוד. פשוט.",
    icon: MessageCircle,
  },
];

export default function HowItWorksPage() {
  return (
    <main className="page-shell pb-24 pt-12 md:pb-28 md:pt-16">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow text-center">איך זה עובד?</p>
        <h1 className="mx-auto mt-3 max-w-xl text-balance text-center page-hero-title">
          שלושה צעדים — מקוד שובר לכסף
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
          <Link href="/dashboard/new" className="btn-cta px-8">
            הוסיפו שובר דיגיטלי
          </Link>
          <Link href="/market" className="btn-secondary px-8">
            שוברים למכירה עכשיו
          </Link>
        </div>
      </div>
    </main>
  );
}
