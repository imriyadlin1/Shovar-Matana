"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function MarkAllReadButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function markAll() {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={markAll}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-brand-deep disabled:opacity-50"
    >
      <CheckCheck className="size-3.5" strokeWidth={2} />
      {loading ? "מעדכן…" : "סמנו הכול כנקרא"}
    </button>
  );
}
