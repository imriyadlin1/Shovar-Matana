"use client";

import Link from "next/link";
import { ExternalLink, Loader2, Mail, MailCheck } from "lucide-react";
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
  const loginHref = `/auth/login?next=${encodeURIComponent(nextPath)}&email=${encodeURIComponent(email)}`;
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
      setToast({ msg: "מייל חדש נשלח. בדקו את התיבה.", variant: "success" });
      setResendCooldownUntil(Date.now() + RESEND_SUCCESS_COOLDOWN_MS);
    } catch {
      setToast({ msg: "לא הצלחנו לשלוח. נסו שוב בעוד דקה.", variant: "error" });
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
      <div className="auth-panel animate-auth-panel-in border-2 border-brand/20 shadow-lg shadow-brand/5">
        <div
          className="rounded-2xl bg-gradient-to-br from-brand-faint/90 via-surface to-surface-muted/40 px-5 py-6 md:px-7 md:py-8"
          role="status"
          aria-live="polite"
        >
          {/* ---- Hero ---- */}
          <div className="flex flex-col items-center text-center">
            <div
              className="flex size-16 items-center justify-center rounded-2xl bg-white text-brand shadow-md ring-2 ring-brand/20"
              aria-hidden
            >
              <Mail className="size-8 stroke-[1.6]" />
            </div>
            <h1 className="mt-5 text-[1.55rem] font-black leading-tight text-brand-deep">
              שלחנו לכם מייל
            </h1>
            <p className="mt-3 max-w-sm text-base font-bold leading-relaxed text-ink">
              פתחו אותו ולחצו על הקישור כדי להפעיל את החשבון
            </p>
            <p className="mt-2 max-w-sm text-sm font-medium text-ink-muted">
              לא מצאתם? בדקו גם בספאם או בקידומי מכירות.
            </p>
          </div>

          {/* ---- Email box ---- */}
          <div className="mt-7 rounded-2xl border-2 border-white/80 bg-white px-5 py-4 shadow-sm">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-brand-deep">
              שלחנו ל
            </p>
            <p className="mt-1.5 break-all text-lg font-bold text-ink" dir="ltr">
              {email}
            </p>
          </div>

          {/* ---- Open email CTA ---- */}
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta mt-6 flex w-full items-center justify-center gap-2 py-3.5 text-base font-bold"
          >
            <MailCheck className="size-5 shrink-0" aria-hidden />
            פתחו את Gmail
            <ExternalLink className="size-4 shrink-0 opacity-60" aria-hidden />
          </a>
          <p className="mt-2 text-center text-xs font-medium text-ink-faint">
            לא Gmail? פתחו את תיבת הדואר שלכם בדפדפן או באפליקציה.
          </p>

          {/* ---- Steps ---- */}
          <div className="mt-7 rounded-2xl border border-slate-200/90 bg-white/90 px-5 py-5">
            <p className="text-sm font-bold text-ink">צעד אחרי צעד</p>
            <ol className="mt-3.5 space-y-3 text-sm font-medium leading-relaxed text-ink-muted">
              <li className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand text-xs font-bold text-white">1</span>
                <span>פתחו את <strong className="text-ink">תיבת הדואר</strong> של הכתובת למעלה.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand text-xs font-bold text-white">2</span>
                <span>לא רואים? בדקו <strong className="text-ink">ספאם / קידומי מכירות</strong>.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand text-xs font-bold text-white">3</span>
                <span><strong className="text-ink">לחצו על הקישור</strong> — תועברו חזרה לאתר כבר מחוברים.</span>
              </li>
            </ol>
          </div>

          {/* ---- About the email ---- */}
          <p className="mt-5 px-1 text-center text-xs font-medium leading-relaxed text-ink-faint">
            המייל נשלח אוטומטית מהמערכת. הוא לגיטימי ובטוח.
            אם לא מגיע תוך דקה — שלחו מחדש בכפתור למטה.
          </p>

          {/* ---- Actions ---- */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={resendConfirmation}
              disabled={resendDisabled}
              className="btn-secondary flex w-full items-center justify-center gap-2 py-3 font-semibold disabled:opacity-60 sm:flex-1"
            >
              {resendSending ? (
                <>
                  <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
                  שולחים…
                </>
              ) : resendSecondsLeft > 0 ? (
                `שליחה בעוד ${resendSecondsLeft} שנ׳`
              ) : (
                "שלחו שוב"
              )}
            </button>
            <Link
              href={loginHref}
              className="btn-primary w-full justify-center py-3 text-center font-semibold sm:flex-1"
            >
              אישרתי — להתחברות
            </Link>
          </div>

          <Link
            href={signupHref}
            onClick={backToForm}
            className="btn-ghost mx-auto mt-6 flex w-full justify-center text-sm font-medium text-ink-muted"
          >
            חזרה להרשמה (אימייל אחר)
          </Link>
        </div>
      </div>
    </main>
  );
}
