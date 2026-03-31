"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

export function CategoryFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("category") ?? "";

  function select(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat) {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => select("")}
        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
          !current
            ? "bg-brand text-white shadow-sm"
            : "bg-surface-muted text-ink-muted hover:bg-brand-faint hover:text-brand-deep"
        }`}
      >
        הכול
      </button>
      {CATEGORIES.map((c) => (
        <button
          key={c}
          onClick={() => select(c)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
            current === c
              ? "bg-brand text-white shadow-sm"
              : "bg-surface-muted text-ink-muted hover:bg-brand-faint hover:text-brand-deep"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
