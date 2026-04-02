"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { AuthToast, type AuthToastVariant } from "@/components/auth/AuthToast";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { safeNextPath } from "@/lib/auth/safeNext";
import { isAuthRateLimitError, signupErrorToHebrew } from "@/lib/auth/auth-errors";
import { setPendingSignup } from "@/lib/auth/pendingSignupStorage";
import { createClient } from "@/lib/supabase/client";

const SIGNUP_RATE_LIMIT_COOLDOWN_MS = 3 * 60 * 1000;

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNextPath(params.get("next"));
  const loginHref = `/auth/login?next=${encodeURIComponent(next)}`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; variant: AuthToastVariant } | null>(null);
  const [submitCooldownUntil, setSubmitCooldownUntil] = useState<number | null>(null);
  const [, setCooldownTick] = useState(0);

  useEffect(() => {
    if (!submitCooldownUntil) return;
    const id = window.setInterval(() => {
      setCooldownTick((n) => n + 1);
      if (Date.now() >= submitCooldownUntil) {
        setSubmitCooldownUntil(null);
        window.clearInterval(id);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [submitCooldownUntil]);

  const cooldownSecondsLeft =
    submitCooldownUntil && submitCooldownUntil > Date.now()
      ? Math.max(0, Math.ceil((submitCooldownUntil - Date.now()) / 1000))
      : 0;
  const formLocked = loading || cooldownSecondsLeft > 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formLocked) return;

    setLoading(true);
    setToast(null);
    try {
      const supabase = createClient();
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback?${new URLSearchParams({ next }).toString()}`
          : "";

      const { data, error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() || undefined },
          emailRedirectTo: redirectTo || undefined,
        },
      });

      if (err) {
        setToast({ msg: signupErrorToHebrew(err.message), variant: "error" });
        if (isAuthRateLimitError(err)) {
          setSubmitCooldownUntil(Date.now() + SIGNUP_RATE_LIMIT_COOLDOWN_MS);
        }
        return;
      }

      const u = data.user;
      const emailNorm = (u?.email ?? email.trim()).trim();

      if (u && !u.email_confirmed_at) {
        if (data.session) {
          await supabase.auth.signOut();
        }
        setPendingSignup(emailNorm, next);
        router.replace("/auth/pending-confirmation");
        return;
      }

      if (data.session) {
        router.push(next);
        router.refresh();
        return;
      }

      if (u?.email_confirmed_at) {
        setToast({ msg: "החשבון פעיל — התחברו.", variant: "info" });
        router.push(loginHref);
        return;
      }

      if (emailNorm) {
        setPendingSignup(emailNorm, next);
        router.replace("/auth/pending-confirmation");
        return;
      }

      setToast({ msg: "משהו השתבש. נסו שוב.", variant: "error" });
    } catch {
      setToast({ msg: "לא הצלחנו ליצור את החשבון. נסו שוב.", variant: "error" });
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
      <div className="auth-panel animate-auth-panel-in">
        <p className="eyebrow">הרשמה</p>
        <h1 className="mt-2 text-2xl font-bold text-brand-deep">חשבון חדש</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          ריכוז כל השוברים והזיכויים שלכם במקום אחד — לנהל, להחליף או למכור.
        </p>
        <div className="mt-8">
          <GoogleLoginButton next={next} />
        </div>
        <div className="relative my-6 flex items-center">
          <div className="flex-1 border-t border-slate-200" />
          <span className="px-3 text-xs font-medium text-ink-faint">או עם אימייל</span>
          <div className="flex-1 border-t border-slate-200" />
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-5" aria-busy={loading}>
          <label className="label-form">
            שם מלא
            <input
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-field"
              placeholder="ישראל ישראלי"
              disabled={formLocked}
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
              disabled={formLocked}
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
              disabled={formLocked}
            />
          </label>

          <div className="flex items-start gap-3 rounded-xl border border-brand/20 bg-brand-faint/60 px-4 py-3.5">
            <Mail className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={1.75} aria-hidden />
            <p className="text-sm font-medium leading-relaxed text-ink">
              אחרי השליחה נשלח לכם <strong className="font-bold">מייל אישור</strong>.
              צריך ללחוץ על הקישור שם כדי להפעיל את החשבון.
            </p>
          </div>

          <button
            type="submit"
            disabled={formLocked}
            className="btn-cta flex items-center justify-center gap-2 py-3.5 text-base font-bold disabled:pointer-events-none disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="size-5 shrink-0 animate-spin" aria-hidden />
                שולחים…
              </>
            ) : cooldownSecondsLeft > 0 ? (
              `אפשר לנסות שוב בעוד ${cooldownSecondsLeft} שנ׳`
            ) : (
              "הרשמה"
            )}
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
