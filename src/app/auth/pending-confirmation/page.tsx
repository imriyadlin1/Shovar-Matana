"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { AwaitingEmailConfirmation } from "@/components/auth/AwaitingEmailConfirmation";
import { readPendingSignup } from "@/lib/auth/pendingSignupStorage";

function PendingConfirmationInner() {
  const [payload, setPayload] = useState<{ email: string; next: string } | null | undefined>(undefined);

  useEffect(() => {
    setPayload(readPendingSignup() ?? null);
  }, []);

  if (payload === undefined) {
    return (
      <main className="page-shell-narrow py-24 text-center">
        <p className="text-sm font-medium text-ink-muted">טוען את מסך האישור…</p>
      </main>
    );
  }

  if (!payload) {
    return (
      <main className="page-shell-narrow pb-24 pt-14 md:pt-20">
        <div className="auth-panel text-center">
          <h1 className="text-xl font-bold text-brand-deep">מחכים לאישור מייל?</h1>
          <p className="mt-4 text-sm font-medium leading-relaxed text-ink-muted">
            כדי להגיע למסך הזה צריך קודם לשלוח הרשמה — אז נשמר השלב ונשלח אליכם מייל. אם פתחתם את הדף
            ידנית או רעננתם בלי הרשמה, חזרו לטופס.
          </p>
          <Link href="/auth/signup" className="btn-cta mx-auto mt-8 inline-flex justify-center px-8 py-3 font-semibold">
            להרשמה
          </Link>
          <p className="mt-6 text-sm text-ink-muted">
            כבר אישרתם במייל?{" "}
            <Link href="/auth/login" className="font-semibold text-brand hover:underline">
              להתחברות
            </Link>
          </p>
        </div>
      </main>
    );
  }

  const signupHref = `/auth/signup?next=${encodeURIComponent(payload.next)}`;
  return (
    <AwaitingEmailConfirmation email={payload.email} nextPath={payload.next} signupHref={signupHref} />
  );
}

export default function PendingConfirmationPage() {
  return (
    <Suspense
      fallback={
        <main className="page-shell-narrow py-24 text-center text-ink-muted">טוען…</main>
      }
    >
      <PendingConfirmationInner />
    </Suspense>
  );
}
