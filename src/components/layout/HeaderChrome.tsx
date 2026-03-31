"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, HelpCircle, House, LayoutGrid, MessageSquare } from "lucide-react";
import type { NavSession } from "@/lib/auth/navSession";

function NavLink({
  href,
  exact,
  children,
}: {
  href: string;
  exact?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={`relative rounded-xl px-3.5 py-2 text-sm font-medium transition active:scale-[0.99] ${
        active
          ? "bg-brand-faint text-brand-deep"
          : "text-ink-muted hover:bg-surface-muted hover:text-brand-deep"
      }`}
    >
      <span className="relative z-10 inline-flex items-center gap-1.5">{children}</span>
      {active && (
        <span
          className="absolute inset-x-2 bottom-1 h-0.5 rounded-full bg-brand"
          aria-hidden
        />
      )}
    </Link>
  );
}

export function HeaderChrome({ email, displayName, isAdmin, unreadConvCount }: NavSession) {
  const userLabel = displayName || email?.split("@")[0] || email;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-surface/92 shadow-nav backdrop-blur-xl supports-[backdrop-filter]:bg-surface/80">
      <div className="page-shell flex max-w-6xl flex-wrap items-center justify-between gap-3 py-3.5 md:gap-y-3">
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3 md:contents">
          <Link href="/" className="group flex min-w-0 flex-col leading-tight transition active:scale-[0.99]">
            <span className="truncate text-lg font-bold tracking-tight text-brand-deep transition group-hover:text-brand">
              שובר מתנה
            </span>
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.12em] text-ink-faint" lang="en">
              Vouchers · value back
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-2 md:hidden">
            {!email ? (
              <>
                <Link
                  href="/auth/login"
                  className="btn-primary whitespace-nowrap px-3 py-2 text-xs transition active:scale-[0.98]"
                >
                  כניסה
                </Link>
                <Link
                  href="/auth/signup"
                  className="btn-secondary whitespace-nowrap px-3 py-2 text-xs transition active:scale-[0.98]"
                >
                  הרשמה
                </Link>
              </>
            ) : null}
          </div>
        </div>
        <nav
          className="hidden w-full items-center gap-0.5 md:flex md:w-auto md:flex-wrap lg:gap-1"
          aria-label="ניווט ראשי"
        >
          <NavLink href="/" exact>
            <>
              <House className="size-3.5 opacity-70" aria-hidden />
              בית
            </>
          </NavLink>
          <NavLink href="/market">
            <>
              <LayoutGrid className="size-3.5 opacity-70" aria-hidden />
              מסחר שוברים
            </>
          </NavLink>
          <NavLink href="/about" exact>
            <>
              <Building2 className="size-3.5 opacity-70" aria-hidden />
              אודות
            </>
          </NavLink>
          <NavLink href="/how-it-works" exact>
            <>
              <HelpCircle className="size-3.5 opacity-70" aria-hidden />
              איך זה עובד
            </>
          </NavLink>
          {email ? (
            <>
              <NavLink href="/dashboard">אזור אישי</NavLink>
              <NavLink href="/messages">
                <>
                  <span className="relative">
                    <MessageSquare className="size-3.5 opacity-70" aria-hidden />
                    {unreadConvCount > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 flex size-3.5 items-center justify-center rounded-full bg-red-500 text-[0.5rem] font-bold leading-none text-white ring-2 ring-white">
                        {unreadConvCount > 9 ? "9+" : unreadConvCount}
                      </span>
                    )}
                  </span>
                  צ׳אט עסקאות
                </>
              </NavLink>
              {isAdmin && (
                <Link
                  className="rounded-xl bg-amber-50 px-3.5 py-2 text-sm font-semibold text-amber-900 ring-1 ring-amber-200/80 transition hover:bg-amber-100/90 active:scale-[0.99]"
                  href="/admin"
                >
                  ניהול מערכת
                </Link>
              )}
              <span className="mx-1 hidden h-5 w-px bg-slate-200 lg:inline" aria-hidden />
              <span
                className="hidden max-w-[9.5rem] truncate text-xs font-medium text-ink-faint lg:inline"
                title={email ?? ""}
              >
                {userLabel}
              </span>
              <form action="/auth/signout" method="post" className="inline">
                <button type="submit" className="btn-ghost text-xs text-ink-muted lg:text-sm">
                  התנתקות
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                className="btn-secondary px-4 py-2 text-sm transition active:scale-[0.99]"
                href="/auth/signup"
              >
                הרשמה
              </Link>
              <Link className="btn-primary px-4 py-2 text-sm transition active:scale-[0.99]" href="/auth/login">
                כניסה
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
