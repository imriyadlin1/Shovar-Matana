"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, House, LayoutGrid, LogOut, MessageSquare } from "lucide-react";
import type { NavSession } from "@/lib/auth/navSession";

function Item({
  href,
  exact,
  icon,
  label,
}: {
  href: string;
  exact?: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 transition active:scale-95 ${
        active ? "text-brand" : "text-ink-muted hover:text-brand-deep"
      }`}
    >
      <span className={active ? "text-brand" : ""}>{icon}</span>
      <span className="max-w-[4rem] truncate text-[0.6rem] font-bold">{label}</span>
      {active && <span className="h-0.5 w-5 rounded-full bg-brand" aria-hidden />}
    </Link>
  );
}

export function BottomNav({ email, unreadConvCount }: NavSession) {
  if (!email) return null;

  const chatIcon = (
    <span className="relative inline-block">
      <MessageSquare className="size-[1.35rem]" strokeWidth={2} />
      {unreadConvCount > 0 && (
        <span className="absolute -right-1 -top-1 flex size-3.5 items-center justify-center rounded-full bg-red-500 text-[0.45rem] font-bold leading-none text-white ring-2 ring-white">
          {unreadConvCount > 9 ? "9+" : unreadConvCount}
        </span>
      )}
    </span>
  );

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-surface/95 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1 shadow-[0_-6px_28px_rgba(15,23,42,0.07)] backdrop-blur-lg md:hidden"
      aria-label="ניווט תחתון"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-between gap-0.5 px-1">
        <Item href="/" exact icon={<House className="size-[1.35rem]" strokeWidth={2} />} label="בית" />
        <Item href="/market" icon={<LayoutGrid className="size-[1.35rem]" strokeWidth={2} />} label="מסחר" />
        <Item href="/messages" icon={chatIcon} label="צ׳אט" />
        <Item href="/dashboard" icon={<Building2 className="size-[1.35rem]" strokeWidth={2} />} label="אזור אישי" />
        <form action="/auth/signout" method="post" className="flex min-w-0 flex-1 flex-col items-center">
          <button
            type="submit"
            className="flex w-full flex-col items-center gap-0.5 rounded-xl py-1.5 text-ink-muted transition hover:text-red-700 active:scale-95"
          >
            <LogOut className="size-[1.35rem]" strokeWidth={2} />
            <span className="max-w-[4rem] truncate text-[0.6rem] font-bold">יציאה</span>
          </button>
        </form>
      </div>
    </nav>
  );
}
