import { InboxListPanel } from "@/components/messages/InboxListPanel";
import { loadInboxForUser } from "@/lib/messages/inbox";
import { createClient } from "@/lib/supabase/server";

export default async function MessagesLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  const rows = await loadInboxForUser(user.id);

  return (
    <div className="page-shell flex flex-col gap-8 pb-24 pt-10 md:flex-row md:items-start md:gap-10 md:pt-12 lg:gap-12">
      <aside className="hidden w-full max-w-sm shrink-0 md:block lg:max-w-[20rem]">
        <div className="md:sticky md:top-24 md:max-h-[calc(100vh-6.5rem)] md:overflow-y-auto md:overflow-x-hidden md:rounded-3xl md:border md:border-slate-200/80 md:bg-surface/95 md:p-4 md:shadow-card">
          <p className="mb-3 hidden text-[0.65rem] font-bold uppercase tracking-[0.12em] text-ink-faint md:block">
            עסקאות פעילות
          </p>
          <InboxListPanel rows={rows} variant="sidebar" />
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
