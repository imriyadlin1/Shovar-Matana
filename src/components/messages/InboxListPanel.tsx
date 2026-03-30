"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { InboxRow } from "@/lib/messages/inbox";

function formatInboxTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "מעכשיו";
  if (mins < 60) return `לפני ${mins} דק׳`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `לפני ${hours} ש׳`;
  return d.toLocaleDateString("he-IL", { month: "short", day: "numeric" });
}

type Props = {
  rows: InboxRow[];
  /** רשימה מלאה במובייל; צדדי בדסקטופ */
  variant: "full" | "sidebar";
};

export function InboxListPanel({ rows, variant }: Props) {
  const pathname = usePathname();
  const compact = variant === "sidebar";

  if (!rows.length) {
    return (
      <div
        className={
          compact
            ? "rounded-2xl border border-dashed border-slate-200/90 bg-surface-muted/40 px-4 py-10 text-center"
            : "card-elevated flex flex-col items-center px-8 py-16 text-center md:py-20"
        }
      >
        <p className="text-sm font-semibold text-brand-deep">אין עדיין שיחות</p>
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">
          מהמסחר — בחרו שובר ושלחו הודעה למציע; כאן תסגרו פרטים.
        </p>
        <Link href="/market" className="btn-primary mt-6 text-xs sm:text-sm">
          לשוברים למסחר
        </Link>
      </div>
    );
  }

  return (
    <ul className={compact ? "flex flex-col gap-1.5" : "flex flex-col gap-3"} role="list">
      {rows.map((r, index) => {
        const href = `/messages/${r.conversationId}`;
        const active = pathname === href;
        const initial = r.peerLabel.trim().charAt(0) || "?";
        const demoUnread = index === 0;

        return (
          <li key={r.conversationId}>
            <Link
              href={href}
              className={`group flex gap-3 rounded-2xl border transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                compact ? "px-3 py-2.5 md:px-3 md:py-3" : "gap-5 p-5 md:p-6"
              } ${
                active
                  ? "border-brand/35 bg-brand-faint/90 shadow-sm ring-1 ring-brand/15"
                  : "border-slate-200/85 bg-surface shadow-card hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-card-hover"
              }`}
            >
              <div
                className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-bold text-brand-deep shadow-sm transition group-hover:scale-[1.02] ${
                  compact ? "h-11 w-11 text-sm from-brand-faint to-accent-faint/80" : "h-14 w-14 text-lg from-brand-faint to-brand/12"
                }`}
                aria-hidden
              >
                {initial}
              </div>
              <div className="min-w-0 flex-1 py-0.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2 gap-y-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <p
                      className={`truncate font-semibold transition ${
                        active ? "text-brand-deep" : "text-ink group-hover:text-brand-deep"
                      }`}
                    >
                      {r.peerLabel}
                    </p>
                    {demoUnread && !active && (
                      <span
                        className="size-2 shrink-0 rounded-full bg-brand shadow-sm ring-2 ring-white"
                        title="הודעות חדשות (דוגמה)"
                        aria-hidden
                      />
                    )}
                  </div>
                  <time
                    className="shrink-0 text-[0.6875rem] font-semibold tabular-nums text-ink-faint"
                    dateTime={r.lastAt}
                    title={new Date(r.lastAt).toLocaleString("he-IL")}
                  >
                    {formatInboxTime(r.lastAt)}
                  </time>
                </div>
                {r.assetTitle && (
                  <p className="mt-0.5 truncate text-[0.6875rem] font-medium text-ink-muted">
                    · {r.assetTitle}
                  </p>
                )}
                <p
                  className={`mt-2 line-clamp-2 text-sm leading-snug text-ink-muted transition group-hover:text-ink ${
                    compact ? "mt-1.5 text-xs" : ""
                  }`}
                >
                  {r.lastPreview ?? "עדיין בלי הודעות — לחצו כדי להתחיל."}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
