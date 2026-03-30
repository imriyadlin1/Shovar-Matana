"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = { userId: string };

export function AssetForm({ userId }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [nominal, setNominal] = useState("");
  const [ask, setAsk] = useState("");
  const [category, setCategory] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const nominalNum = parseFloat(nominal) || 0;
    let askNum = parseFloat(ask);
    if (!Number.isFinite(askNum) || askNum < 0) {
      askNum = Math.round(nominalNum * 0.85);
    }
    try {
      const supabase = createClient();
      const { error: err } = await supabase.from("assets").insert({
        owner_id: userId,
        title: title.trim() || "ללא כותרת",
        nominal_value: nominalNum,
        ask_price: askNum,
        category: category.trim() || null,
        status: publish ? "listed" : "draft",
        published_at: publish ? new Date().toISOString() : null,
      });
      if (err) {
        setError(err.message);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("שמירה נכשלה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
      <p className="rounded-xl border border-red-100/90 bg-red-50/80 px-4 py-3 text-sm font-semibold text-red-950">
        מה כבר שילמתם עליו? זה נכנס לנומינלי — שם נמדד הבזבוז.
      </p>
      <label className="flex flex-col gap-1 text-sm font-medium">
        מה זה (קצר)
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border px-3 py-2"
          required
          placeholder="למשל: שובר קפה שרכשתם"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        כמה זה על הנייר · ₪ (כבר יצא מהכיס)
        <input
          type="number"
          value={nominal}
          onChange={(e) => setNominal(e.target.value)}
          className="rounded-lg border px-3 py-2 font-semibold tabular-nums"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        כמה אתם רוצים עליו עכשיו · ₪ (ריק ≈ 85% מהנומינלי)
        <input
          type="number"
          value={ask}
          onChange={(e) => setAsk(e.target.value)}
          className="rounded-lg border px-3 py-2 font-semibold tabular-nums"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        סוג / קטגוריה
        <input value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border px-3 py-2" />
      </label>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
        שחררו מיד לחלון המסחר (גלוי לכולם)
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-money py-3 text-base font-bold text-white shadow-md disabled:opacity-60"
      >
        {loading ? "שומרים…" : "שמרו במאגר — תראו את הסכום למעלה"}
      </button>
    </form>
  );
}
