"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Props = { assetId: string; currentStatus: string };

export function AssetActions({ assetId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isListed = currentStatus === "listed";
  const isSold = currentStatus === "sold";

  async function togglePublish() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const next = isListed ? "draft" : "listed";
    const { error: err } = await supabase
      .from("assets")
      .update({
        status: next,
        published_at: next === "listed" ? new Date().toISOString() : null,
      })
      .eq("id", assetId);
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("בטוחים שרוצים למחוק את השובר? הפעולה לא הפיכה.")) return;
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.from("assets").delete().eq("id", assetId);
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {!isSold && (
          <button
            onClick={togglePublish}
            disabled={loading}
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition disabled:opacity-50 ${
              isListed
                ? "border border-slate-200 bg-surface text-ink-muted hover:bg-surface-muted"
                : "bg-brand text-white hover:bg-brand-deep"
            }`}
          >
            {isListed ? (
              <>
                <EyeOff className="size-4" strokeWidth={2} />
                הסתרה מהשוק
              </>
            ) : (
              <>
                <Eye className="size-4" strokeWidth={2} />
                פרסום לשוק
              </>
            )}
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={loading}
          className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
        >
          <Trash2 className="size-4" strokeWidth={2} />
          מחיקה
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
