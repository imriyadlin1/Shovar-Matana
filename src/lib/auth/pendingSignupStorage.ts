import { safeNextPath } from "@/lib/auth/safeNext";

const PENDING_EMAIL_KEY = "shovar_pending_email";
const PENDING_NEXT_KEY = "shovar_pending_next";

/** נשמר אחרי הרשמה כשצריך אישור מייל — מאפשר דף ייעודי וריענון */
export function setPendingSignup(email: string, next: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_EMAIL_KEY, email.trim());
  sessionStorage.setItem(PENDING_NEXT_KEY, safeNextPath(next));
}

export function readPendingSignup(): { email: string; next: string } | null {
  if (typeof window === "undefined") return null;
  const email = sessionStorage.getItem(PENDING_EMAIL_KEY);
  const rawNext = sessionStorage.getItem(PENDING_NEXT_KEY);
  if (!email?.trim()) return null;
  return { email: email.trim(), next: safeNextPath(rawNext) };
}

export function clearPendingSignup() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_EMAIL_KEY);
  sessionStorage.removeItem(PENDING_NEXT_KEY);
}
