import Link from "next/link";
import { redirect } from "next/navigation";
import { InboxListPanel } from "@/components/messages/InboxListPanel";
import { loadInboxForUser } from "@/lib/messages/inbox";
import { createClient } from "@/lib/supabase/server";

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login?next=/messages");
  }

  const rows = await loadInboxForUser(user.id);

  return (
    <main className="min-w-0">
      <header className="max-w-2xl md:max-w-none">
        <p className="eyebrow">צ׳אט עסקאות</p>
        <h1 className="mt-3 page-hero-title">סוגרים כאן — מחיר, זמן, שובר</h1>
        <p className="mt-4 max-w-lg text-sm font-medium leading-relaxed text-ink-muted md:text-base">
          פחות „שלחתי הודעה”. יותר „סיכמנו”. מחשב: רשימה בצד · נייד: הכול למטה.
        </p>
      </header>

      <div className="mt-10 md:hidden">
        <InboxListPanel rows={rows} variant="full" />
      </div>

      <div className="mt-10 hidden min-h-[min(60vh,28rem)] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200/90 bg-surface-muted/35 px-8 py-16 text-center md:flex">
        <span className="text-3xl opacity-[0.2]" aria-hidden>
          ◈
        </span>
        <p className="mt-6 max-w-sm text-base font-semibold text-brand-deep">בחרו שיחה מהרשימה בצד</p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
          בצ׳אט תסכמו עם הצד השני עד שיש ביניכם הבנה — זה השלב שלפני העברת השובר או התשלום מאחורי הקלעים.
        </p>
        {!rows.length && (
          <Link href="/market" className="btn-primary mt-10">
            לשוברים למסחר
          </Link>
        )}
      </div>
    </main>
  );
}
