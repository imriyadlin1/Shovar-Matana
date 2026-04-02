"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";

export function WelcomeToast() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (params.get("confirmed") !== "1") return;
    setVisible(true);

    const url = new URL(window.location.href);
    url.searchParams.delete("confirmed");
    router.replace(`${pathname}${url.search}`, { scroll: false });

    const timer = setTimeout(() => setVisible(false), 3500);
    return () => clearTimeout(timer);
  }, [params, router, pathname]);

  if (!visible) return null;

  return (
    <div className="pointer-events-auto animate-auth-toast-in fixed bottom-20 start-4 end-4 z-[200] max-w-md md:bottom-5 md:start-auto md:end-8">
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200/90 bg-emerald-50 px-4 py-3.5 text-emerald-950 shadow-md shadow-emerald-900/10">
        <CheckCircle2 className="size-5 shrink-0 text-emerald-600" strokeWidth={2} aria-hidden />
        <p className="min-w-0 flex-1 text-sm font-semibold leading-snug">
          החשבון מאושר ומוכן. אתם בפנים.
        </p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="flex size-6 shrink-0 items-center justify-center rounded-full text-emerald-700 transition hover:bg-emerald-100"
          aria-label="סגירה"
        >
          <X className="size-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
