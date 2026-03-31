"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export type AuthToastVariant = "error" | "success" | "info";

type Props = {
  message: string | null;
  variant?: AuthToastVariant;
  onDismiss: () => void;
  /** ברירת מחדל: 7000ms */
  durationMs?: number;
};

const surface: Record<AuthToastVariant, string> = {
  error: "border-red-200/90 bg-red-50 text-red-950 shadow-md shadow-red-900/10",
  success: "border-emerald-200/90 bg-emerald-50 text-emerald-950 shadow-md shadow-emerald-900/10",
  info: "border-slate-200/90 bg-surface text-ink shadow-card",
};

const defaultDuration: Record<AuthToastVariant, number> = {
  error: 7000,
  success: 5000,
  info: 10000,
};

export function AuthToast({ message, variant = "error", onDismiss, durationMs }: Props) {
  const duration = durationMs ?? defaultDuration[variant];

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [message, duration, onDismiss]);

  if (!message) return null;

  return (
    <div
      className="pointer-events-auto animate-auth-toast-in fixed bottom-5 start-4 end-4 z-[200] max-w-md md:start-auto md:end-8"
      role={variant === "error" ? "alert" : "status"}
    >
      <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 ${surface[variant]}`}>
        <p className="min-w-0 flex-1 text-sm font-semibold leading-snug">{message}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-lg p-1 text-current opacity-70 transition hover:bg-black/5 hover:opacity-100"
          aria-label="סגירה"
        >
          <X className="size-4" strokeWidth={2.25} aria-hidden />
        </button>
      </div>
    </div>
  );
}
