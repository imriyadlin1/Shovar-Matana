import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminHomePage() {
  let counts = { profiles: 0, assets: 0, messages: 0 };
  try {
    const admin = createAdminClient();
    const [p, a, m] = await Promise.all([
      admin.from("profiles").select("id", { count: "exact", head: true }),
      admin.from("assets").select("id", { count: "exact", head: true }),
      admin.from("messages").select("id", { count: "exact", head: true }),
    ]);
    counts = {
      profiles: p.count ?? 0,
      assets: a.count ?? 0,
      messages: m.count ?? 0,
    };
  } catch {
    /* service key חסר בפיתוח */
  }

  return (
    <main className="page-shell py-12 pb-24 md:py-16">
      <header className="max-w-2xl border-b border-amber-200/70 pb-10">
        <p className="eyebrow text-amber-900/80">אזור מורשים</p>
        <h1 className="mt-3 page-hero-title">סקירת מערכת</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-muted md:text-base">
          מדדי כמויות בלבד. פעולות רגישות דורשות מפתח שירות בשרת — לא דרך הדפדפן.
        </p>
      </header>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        <Stat label="משתמשים רשומים" value={counts.profiles} />
        <Stat label="שוברים במערכת" value={counts.assets} />
        <Stat label="הודעות בצ׳אטים" value={counts.messages} />
      </div>

      <section className="card-elevated mt-14 p-8 md:p-10">
        <h2 className="section-title">ייצוא נתונים (CSV)</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
          קבצים לפתיחה ב-Excel או בכלי BI. הורדות זמינות רק למנהלים מחוברים.
        </p>
        <ul className="mt-8 flex flex-wrap gap-3">
          <li>
            <Link
              className="btn-secondary px-5 py-2.5 text-sm font-semibold"
              href="/api/admin/export?resource=profiles"
            >
              משתמשים
            </Link>
          </li>
          <li>
            <Link
              className="btn-secondary px-5 py-2.5 text-sm font-semibold"
              href="/api/admin/export?resource=assets"
            >
              שוברים
            </Link>
          </li>
          <li>
            <Link
              className="btn-secondary px-5 py-2.5 text-sm font-semibold"
              href="/api/admin/export?resource=messages"
            >
              הודעות
            </Link>
          </li>
          <li>
            <Link
              className="btn-secondary px-5 py-2.5 text-sm font-semibold"
              href="/api/admin/export?resource=site_content"
            >
              תוכן אתר
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card-elevated border-amber-100/60 bg-gradient-to-br from-white to-amber-50/40 p-7">
      <p className="eyebrow text-amber-900/75">{label}</p>
      <p className="mt-3 text-4xl font-bold tabular-nums text-brand-deep">{value}</p>
    </div>
  );
}
