"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthToast, type AuthToastVariant } from "@/components/auth/AuthToast";
import { authResendErrorToHebrew, isAuthRateLimitError } from "@/lib/auth/auth-errors";
import { clearPendingSignup } from "@/lib/auth/pendingSignupStorage";
import { createClient } from "@/lib/supabase/client";

const RESEND_SUCCESS_COOLDOWN_MS = 45_000;
const RESEND_RATE_LIMIT_COOLDOWN_MS = 3 * 60 * 1000;

type Props = {
  email: string;
  nextPath: string;
  signupHref: string;
};

export function AwaitingEmailConfirmation({ email, nextPath, signupHref }: Props) {
  const loginHref = `/auth/login?next=${encodeURIComponent(nextPath)}`;
  const [toast, setToast] = useState<{ msg: string; variant: AuthToastVariant } | null>(null);
  const [resendSending, setResendSending] = useState(false);
  const [resendCooldownUntil, setResendCooldownUntil] = useState<number | null>(null);
  const [, setResendTick] = useState(0);

  useEffect(() => {
    if (!resendCooldownUntil) return;
    const id = window.setInterval(() => {
      setResendTick((n) => n + 1);
      if (Date.now() >= resendCooldownUntil) {
        setResendCooldownUntil(null);
        window.clearInterval(id);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [resendCooldownUntil]);

  const resendSecondsLeft =
    resendCooldownUntil && resendCooldownUntil > Date.now()
      ? Math.max(0, Math.ceil((resendCooldownUntil - Date.now()) / 1000))
      : 0;
  const resendDisabled = resendSending || resendSecondsLeft > 0;

  function callbackUrlForRedirect() {
    if (typeof window === "undefined") return "";
    const q = new URLSearchParams({ next: nextPath });
    return `${window.location.origin}/auth/callback?${q.toString()}`;
  }

  async function resendConfirmation() {
    if (!email || resendDisabled) return;
    setResendSending(true);
    setToast(null);
    try {
      const supabase = createClient();
      const redirectTo = callbackUrlForRedirect();
      const { error: err } = await supabase.auth.resend({
        type: "signup",
        email,
        options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
      });
      if (err) {
        setToast({ msg: authResendErrorToHebrew(err.message), variant: "error" });
        if (isAuthRateLimitError(err)) {
          setResendCooldownUntil(Date.now() + RESEND_RATE_LIMIT_COOLDOWN_MS);
        }
        return;
      }
      setToast({
        msg: "המייל נשלח בהצלחה. בדקו את התיבה (וגם ספאם) — לפעמים זה מגיע תוך כמה שניות.",
        variant: "success",
      });
      setResendCooldownUntil(Date.now() + RESEND_SUCCESS_COOLDOWN_MS);
    } catch {
      setToast({ msg: "לא הצלחנו לשלוח עכשיו. נסו שוב בעוד דקות.", variant: "error" });
    } finally {
      setResendSending(false);
    }
  }

  function backToForm() {
    clearPendingSignup();
    setToast(null);
    setResendCooldownUntil(null);
  }

  return (
    <main className="page-shell-narrow pb-20 pt-10 md:pb-28 md:pt-14">
      <AuthToast
        message={toast?.msg ?? null}
        variant={toast?.variant ?? "error"}
        onDismiss={() => setToast(null)}
      />
      <div className="auth-panel border-2 border-brand/20 shadow-lg shadow-brand/5">
        <div
          className="rounded-2xl bg-gradient-to-br from-brand-faint/90 via-surface to-surface-muted/40 px-5 py-6 md:px-7 md:py-8"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center text-center">
            <div
              className="flex size-[4.5rem] items-center justify-center rounded-2xl bg-white text-brand shadow-md ring-2 ring-brand/20"
              aria-hidden
            >
              <Mail className="size-9 stroke-[1.6]" />
            </div>
            <h1 className="mt-6 text-2xl font-black leading-tight text-brand-deep md:text-[1.75rem]">
              החשבון עדיין לא פעיל
            </h1>
            <p className="mt-4 max-w-md text-base font-bold leading-relaxed text-ink">
              צריך לאשר את המייל כדי להמשיך
            </p>
            <p className="mt-2 max-w-md text-sm font-medium leading-relaxed text-ink-muted">
              זה שלב רגיל — לא תקלה. המערכת מחכה שתלחצו על הקישור שנשלח אליכם, ואז תוכלו להיכנס לכספת
              השוברים.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border-2 border-white/80 bg-white px-5 py-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-deep">המייל שנרשמתם איתו</p>
            <p className="mt-2 break-all text-lg font-bold text-ink" dir="ltr">
              {email}
            </p>
            <p className="mt-2 text-xs font-medium text-ink-muted">
              אם זו לא הכתובת הנכונה — חזרו לטופס הרשמה למטה.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200/90 bg-white/90 px-5 py-5">
            <p className="text-sm font-bold text-ink">מה לעשות עכשיו</p>
            <ol className="mt-4 space-y-3.5 text-sm font-medium leading-relaxed text-ink-muted">
              <li className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white">
                  1
                </span>
                <span>
                  פתחו את <strong className="text-ink">תיבת האימייל</strong> (אצל הספק שלכם או באפליקציה).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white">
                  2
                </span>
                <span>
                  אם אין מייל תוך דקה — בדקו <strong className="text-ink">ספאם / זבל / קידומי מכירות</strong>.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white">
                  3
                </span>
                <span>
                  <strong className="text-ink">לחצו על הקישור לאישור</strong> במייל (לפעמים &quot;Verify&quot; או
                  &quot;Confirm&quot;).
                </span>
              </li>
            </ol>
            <p className="mt-5 rounded-xl bg-surface-muted/80 px-4 py-3 text-xs font-semibold leading-relaxed text-ink-muted">
              אחרי הלחיצה תועברו לאתר ותהיו מחוברים — ואז אפשר להתחיל לעבוד עם הכספת.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={resendConfirmation}
              disabled={resendDisabled}
              className="btn-secondary w-full justify-center py-3.5 font-semibold disabled:opacity-60 sm:flex-1"
            >
              {resendSending
                ? "שולחים מייל…"
                : resendSecondsLeft > 0
                  ? `ניתן לשלוח שוב בעוד ${resendSecondsLeft} שנ׳`
                  : "שלחו לי שוב את מייל האישור"}
            </button>
            <Link
              href={loginHref}
              className="btn-primary w-full justify-center py-3.5 text-center font-semibold sm:flex-1"
            >
              סיימתי — להתחברות
            </Link>
          </div>

          <Link
            href={signupHref}
            onClick={backToForm}
            className="btn-ghost mx-auto mt-8 flex w-full justify-center text-sm font-medium text-ink-muted"
          >
            חזרה להרשמה (אימייל אחר או תיקון)
          </Link>
        </div>
      </div>
    </main>
  );
}
