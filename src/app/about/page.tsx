import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "אודות · שובר מתנה",
  description: "למה בנינו את זה — שוברים, זיכויים, ומקום אחד לנהל הכול.",
};

export default function AboutPage() {
  return (
    <main className="page-shell pb-24 pt-12 md:pb-28 md:pt-16">
      <article className="mx-auto max-w-3xl">
        <p className="eyebrow">אודות</p>
        <h1 className="mt-3 page-hero-title">למה בנינו את זה</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-muted">
          להרבה אנשים יש שוברים וזיכויים שהם לא משתמשים בהם.
          <br />
          הם נשארים במיילים, באפליקציות או נשכחים לגמרי.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">
          בנינו מקום פשוט שמרכז הכול,
          <br />
          ועוזר להבין מה שווה להשתמש ומה אפשר להעביר הלאה.
        </p>

        <div className="mt-14 flex flex-wrap gap-4">
          <Link href="/how-it-works" className="btn-primary">
            איך זה עובד
          </Link>
          <Link href="/market" className="btn-secondary">
            ראו שוברים של אחרים
          </Link>
        </div>
      </article>
    </main>
  );
}
