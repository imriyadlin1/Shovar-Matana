"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { safeNextPath } from "@/lib/auth/safeNext";
import { createClient } from "@/lib/supabase/client";

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNextPath(params.get("next"));
  const loginHref = `/auth/login?next=${encodeURIComponent(next)}`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (err) {
        setError(err.message);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("לא הצלחנו ליצור את החשבון. נסו שוב.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell-narrow pb-20 pt-10 md:pb-28 md:pt-14">
      <div className="auth-panel">
        <p className="eyebrow">הרשמה</p>
        <h1 className="mt-2 text-2xl font-bold text-brand-deep">חשבון חדש</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          כמה שדות — ואפשר לאסוף שוברים במאגר, לראות שווי ולפתוח צ׳אט עד סגירת עסקה.
        </p>
        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
          <label className="label-form">
            שם מלא
            <input
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-field"
              placeholder="ישראל ישראלי"
            />
          </label>
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
            <span className="text-xs font-normal text-ink-faint">לפחות 6 תווים</span>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              className="input-field"
              required
            />
          </label>
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-900">{error}</p>}
          <button type="submit" disabled={loading} className="btn-cta mt-1 py-3 disabled:opacity-60">
            {loading ? "יוצרים חשבון…" : "יצירת חשבון"}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-ink-muted">
          כבר רשומים?{" "}
          <Link href={loginHref} className="font-semibold text-brand hover:underline">
            התחברו כאן
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<main className="page-shell-narrow py-20 text-center text-ink-muted">טוען…</main>}>
      <SignupForm />
    </Suspense>
  );
}
