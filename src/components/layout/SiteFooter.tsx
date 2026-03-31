import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-surface/90 py-12 backdrop-blur-sm">
      <div className="page-shell grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        <div>
          <p className="text-sm font-bold text-brand-deep">שובר מתנה</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
            מרכזים שוברים וזיכויים במקום אחד — רואים מה שווה, ומחליטים מה לעשות.
          </p>
        </div>
        <div>
          <p className="eyebrow text-ink-muted">מידע</p>
          <ul className="mt-4 space-y-2.5 text-sm font-medium">
            <li>
              <Link className="text-ink-muted transition hover:text-brand" href="/about">
                אודות
              </Link>
            </li>
            <li>
              <Link className="text-ink-muted transition hover:text-brand" href="/how-it-works">
                איך זה עובד
              </Link>
            </li>
            <li>
              <Link className="text-ink-muted transition hover:text-brand" href="/faq">
                שאלות נפוצות
              </Link>
            </li>
            <li>
              <Link className="text-ink-muted transition hover:text-brand" href="/contact">
                יצירת קשר
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-ink-muted">המשך שימוש</p>
          <ul className="mt-4 space-y-2.5 text-sm font-medium">
            <li>
              <Link className="text-ink-muted transition hover:text-brand" href="/market">
                מסחר שוברים
              </Link>
            </li>
            <li>
              <Link className="text-ink-muted transition hover:text-brand" href="/auth/login">
                כניסה
              </Link>
            </li>
            <li>
              <Link className="text-ink-muted transition hover:text-brand" href="/auth/signup">
                הרשמה
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="page-shell mt-10 border-t border-slate-100 pt-8">
        <p className="text-center text-xs text-ink-faint">
          © {new Date().getFullYear()} שובר מתנה · השימוש באחריות המשתמשים בלבד
        </p>
      </div>
    </footer>
  );
}
