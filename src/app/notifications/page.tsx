import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { MarkAllReadButton } from "@/components/notifications/MarkAllReadButton";

type NotifRow = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

const TYPE_ICON: Record<string, typeof Bell> = {
  new_chat: MessageCircle,
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/notifications");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const rows = (notifications ?? []) as NotifRow[];
  const hasUnread = rows.some((n) => !n.is_read);

  return (
    <main className="page-shell max-w-2xl py-10 pb-24 md:py-14">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-deep">התראות</h1>
        {hasUnread && <MarkAllReadButton />}
      </div>

      {!rows.length && (
        <div className="card-elevated mt-10 flex flex-col items-center px-8 py-14 text-center">
          <Bell className="size-10 text-ink-faint/30" strokeWidth={1.5} />
          <p className="mt-4 text-lg font-bold text-brand-deep">אין התראות</p>
          <p className="mt-2 text-sm text-ink-muted">כשמישהו יפתח צ׳אט על שובר שלכם — תקבלו התראה כאן.</p>
        </div>
      )}

      {rows.length > 0 && (
        <ul className="mt-8 space-y-3">
          {rows.map((n) => {
            const Icon = TYPE_ICON[n.type] ?? Bell;
            const content = (
              <div className={`card-elevated flex items-start gap-4 px-5 py-4 transition ${
                !n.is_read ? "border-brand/20 bg-brand-faint/20" : ""
              } ${n.link ? "hover:border-brand/25 hover:shadow-card-hover" : ""}`}>
                <div className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl ${
                  !n.is_read ? "bg-brand/10 text-brand" : "bg-surface-muted text-ink-faint"
                }`}>
                  <Icon className="size-4" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-bold ${!n.is_read ? "text-brand-deep" : "text-ink"}`}>
                    {n.title}
                  </p>
                  {n.body && (
                    <p className="mt-1 text-sm text-ink-muted">{n.body}</p>
                  )}
                  <p className="mt-2 text-xs text-ink-faint">
                    {new Date(n.created_at).toLocaleString("he-IL", { dateStyle: "short", timeStyle: "short" })}
                  </p>
                </div>
                {!n.is_read && (
                  <span className="mt-2 size-2 shrink-0 rounded-full bg-brand" />
                )}
              </div>
            );
            return (
              <li key={n.id}>
                {n.link ? (
                  <Link href={n.link}>{content}</Link>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
