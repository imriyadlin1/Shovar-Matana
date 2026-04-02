"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

type Props = { path: string; label?: string };

export function CopyLinkButton({ path, label = "העתקת קישור" }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard not available */ }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
        copied
          ? "border-money/30 bg-money-faint text-money-dark"
          : "border-slate-200 bg-surface text-ink-muted hover:border-brand/20 hover:bg-surface-muted hover:text-brand-deep"
      }`}
    >
      {copied ? (
        <>
          <Check className="size-4" strokeWidth={2.5} />
          הועתק!
        </>
      ) : (
        <>
          <Link2 className="size-4" strokeWidth={2} />
          {label}
        </>
      )}
    </button>
  );
}
