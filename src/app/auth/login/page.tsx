"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { safeNextPath } from "@/lib/auth/safeNext";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNextPath(params.get("next"));
  const signupHref = `/auth/signup?next=${encodeURIComponent(next)}`;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    params.get("error") === "config" ? "חסרות הגדרות Supabase (בדקו את .env.local)." : null,
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError("פרטי ההתחברות אינם תואמים. נסו שוב.");
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("משהו השתבש. נסו שוב בעוד רגע.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell-narrow pb-20 pt-10 md:pb-28 md:pt-14">
      <div className="auth-panel">
        <p className="eyebrow">כניסה</p>
        <h1 className="mt-2 text-2xl font-bold text-brand-deep">ברוכים השבים</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          התחברו עם האימייל והסיסמה שאיתם נרשמתם.
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
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-900">{error}</p>}
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
