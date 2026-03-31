"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AuthToast, type AuthToastVariant } from "@/components/auth/AuthToast";
import { safeNextPath } from "@/lib/auth/safeNext";
import { loginErrorToHebrew } from "@/lib/auth/auth-errors";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNextPath(params.get("next"));
  const signupHref = `/auth/signup?next=${encodeURIComponent(next)}`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; variant: AuthToastVariant } | null>(null);

  useEffect(() => {
    const err = params.get("error");
    if (err === "config") {
      setToast({
        msg: "חסרות הגדרות Supabase (בדקו משתני סביבה ב-Vercel / .env.local).",
        variant: "error",
      });
      return;
    }
    if (err === "auth") {
      setToast({
        msg: "הקישור מהמייל לא השלים את ההתחברות (פג תוקף או קישור שגוי). נסו להרשם מחדש או להתחבר עם סיסמה.",
        variant: "error",
      });
    }
  }, [params]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setToast(null);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setToast({ msg: loginErrorToHebrew(err.message), variant: "error" });
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setToast({ msg: "משהו השתבש. נסו שוב בעוד רגע.", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell-narrow pb-20 pt-10 md:pb-28 md:pt-14">
      <AuthToast
        message={toast?.msg ?? null}
        variant={toast?.variant ?? "error"}
        onDismiss={() => setToast(null)}
      />
      <div className="auth-panel">
        <p className="eyebrow">כניסה</p>
        <h1 className="mt-2 text-2xl font-bold text-brand-deep">ברוכים השבים</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          התחברו עם האימייל והסיסמה שאיתם נרשמתם.
        </p>
        <p className="mt-4 rounded-xl border border-slate-200/80 bg-surface-muted/50 px-4 py-3 text-xs font-medium leading-relaxed text-ink-muted">
          נרשמתם לאחרונה? <strong className="font-semibold text-ink">קודם לוחצים על הקישור במייל לאישור</strong>, ורק
          אז ממלאים כאן — בלי אישור אי אפשר להיכנס עדיין, וזה חלק תקין מהתהליך.
        </p>
        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
          <label className="label-form">
            אימייל
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="label-form">
            סיסמה
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </label>
          <button type="submit" disabled={loading} className="btn-primary mt-1 py-3 disabled:opacity-60">
            {loading ? "מתחברים…" : "כניסה לחשבון"}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-ink-muted">
          עדיין אין חשבון?{" "}
          <Link href={signupHref} className="font-semibold text-brand hover:underline">
            הרשמה קצרה
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="page-shell-narrow py-20 text-center text-ink-muted">טוען…</main>}>
      <LoginForm />
    </Suspense>
  );
}
